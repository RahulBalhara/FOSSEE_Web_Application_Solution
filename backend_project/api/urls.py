# api/urls.py

from django.urls import path
from . import views  # Import views from the current app directory

urlpatterns = [
    # /api/upload/
    path('upload/', views.CSVUploadView.as_view(), name='csv-upload'),
    
    # /api/history/
    path('history/', views.HistoryListView.as_view(), name='history-list'),
    
    # /api/report/1/ (example)
    path('report/<int:id>/', views.PDFReportView.as_view(), name='pdf-report'),
]