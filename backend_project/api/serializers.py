# api/serializers.py
from rest_framework import serializers
from .models import DatasetUpload

class DatasetUploadSerializer(serializers.ModelSerializer):
    """
    Serializes the DatasetUpload model into JSON.
    """
    class Meta:
        model = DatasetUpload
        # These are the fields that will be included in the API response.
        fields = ['id', 'file_name', 'uploaded_at', 'summary_data']