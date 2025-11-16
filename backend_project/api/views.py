# api/views.py
import io
import pandas as pd
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from rest_framework import status, views, generics
from rest_framework.response import Response
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import DatasetUpload
from .serializers import DatasetUploadSerializer

# ---
# 1. CSV Upload View (Handles Features: 1, 2, and 4)
# ---
class CSVUploadView(views.APIView):
    """
    API endpoint for:
    1. CSV Upload [cite: 13]
    2. Data Summary API (calculates and returns summary) [cite: 14]
    4. History Management (saves summary and trims old ones) 
    """
    # Use Basic Authentication as required [cite: 17]
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')

        if not file:
            return Response({"error": "No file was uploaded."}, status=status.HTTP_400_BAD_REQUEST)
        
        if not file.name.endswith('.csv'):
            return Response({"error": "This is not a CSV file."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Use Pandas to read the uploaded CSV from memory [cite: 11]
            decoded_file = file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            df = pd.read_csv(io_string)
            
            # --- Feature 2: Data Summary Logic ---
            # Check for required columns
            required_cols = {'Equipment Name', 'Type', 'Flowrate', 'Pressure', 'Temperature'}
            if not required_cols.issubset(df.columns):
                return Response({"error": f"Missing required columns. Needed: {required_cols}"}, status=status.HTTP_400_BAD_REQUEST)
                
            total_count = len(df)
            averages = df[['Flowrate', 'Pressure', 'Temperature']].mean().to_dict()
            type_distribution = df['Type'].value_counts().to_dict()

            summary = {
                "total_count": total_count,
                "averages": averages,
                "type_distribution": type_distribution
            }
            # --- End of Summary Logic ---
            
            # --- Feature 4: History Management (Save) ---
            upload_instance = DatasetUpload.objects.create(
                file_name=file.name,
                summary_data=summary
            )
            
            # Keep only the last 5 datasets
            all_uploads = DatasetUpload.objects.all()
            if all_uploads.count() > 5:
                # Delete the oldest one (thanks to 'ordering' in models.py)
                all_uploads.last().delete()
            # --- End of History Logic ---

            # Serialize the new instance and return it
            serializer = DatasetUploadSerializer(upload_instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"An error occurred while processing the file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


# ---
# 2. History List View (Handles Feature: 4)
# ---
class HistoryListView(generics.ListAPIView):
    """
    API endpoint for:
    4. History Management (Retrieving the last 5 summaries) 
    """
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]
    
    # The model's default ordering handles getting the most recent.
    # The upload view ensures there are never more than 5.
    queryset = DatasetUpload.objects.all()
    serializer_class = DatasetUploadSerializer


# ---
# 3. PDF Report View (Handles Feature: 5)
# ---
class PDFReportView(views.APIView):
    """
    API endpoint for:
    5. Generate PDF report [cite: 17]
    """
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        try:
            # Get the specific historical upload
            upload = DatasetUpload.objects.get(id=id)
        except DatasetUpload.DoesNotExist:
            return Response({"error": "Report not found."}, status=status.HTTP_404_NOT_FOUND)

        # Create an HTTP response with PDF headers
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="report_{upload.id}_{upload.file_name}.pdf"'

        # --- Create the PDF document using ReportLab ---
        p = canvas.Canvas(response)
        p.setTitle(f"Report for {upload.file_name}")

        p.setFont("Helvetica-Bold", 16)
        p.drawString(100, 800, "Chemical Equipment Report")

        p.setFont("Helvetica", 12)
        p.drawString(100, 780, f"File Name: {upload.file_name}")
        p.drawString(100, 765, f"Uploaded At: {upload.uploaded_at.strftime('%Y-%m-%d %H:%M')}")
        
        y_position = 730
        p.setFont("Helvetica-Bold", 13)
        p.drawString(100, y_position, "Summary")
        y_position -= 20

        # Draw summary data from the JSONField
        summary = upload.summary_data
        p.setFont("Helvetica", 12)
        
        p.drawString(120, y_position, f"Total Equipment Count: {summary['total_count']}")
        y_position -= 25
        
        p.setFont("Helvetica-Bold", 12)
        p.drawString(120, y_position, "Averages:")
        y_position -= 20
        p.setFont("Helvetica", 12)
        for key, value in summary['averages'].items():
            p.drawString(140, y_position, f"{key}: {value:.2f}")
            y_position -= 20
        
        y_position -= 10
        p.setFont("Helvetica-Bold", 12)
        p.drawString(120, y_position, "Equipment Type Distribution:")
        y_position -= 20
        p.setFont("Helvetica", 12)
        for key, value in summary['type_distribution'].items():
            p.drawString(140, y_position, f"{key}: {value}")
            y_position -= 20

        # Close the PDF object cleanly
        p.showPage()
        p.save()
        # --- End of PDF Generation ---

        return response