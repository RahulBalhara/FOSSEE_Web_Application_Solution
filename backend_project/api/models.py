# api/models.py
from django.db import models

class DatasetUpload(models.Model):
    """
    Stores a summary of an uploaded equipment dataset.
    """
    file_name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    # We store the calculated summary (counts, averages, etc.)
    # in a flexible JSONField.
    summary_data = models.JSONField()

    def __str__(self):
        return f"{self.file_name} (Uploaded on: {self.uploaded_at.strftime('%Y-%m-%d %H:%M')})"

    class Meta:
        # Always order by the most recent upload first.
        ordering = ['-uploaded_at']