import sys
import requests
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLabel, QLineEdit, QPushButton, QFileDialog, QMessageBox,
    QTabWidget, QListWidget, QListWidgetItem, QGroupBox, QSpacerItem, QSizePolicy
)
from PyQt5.QtCore import Qt, QSize
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

# --- Custom Styling (QSS) for a Modern Look ---
STYLESHEET = """
QMainWindow {
    background-color: #f0f4f8; /* Light blue-gray background */
}

QTabWidget::pane { /* The area below the tab bar */
    border: 1px solid #c8d2dc; 
    background-color: #ffffff;
}

QTabBar::tab {
    background: #e2e8f0;
    border: 1px solid #c8d2dc;
    border-bottom-color: #c8d2dc; /* same as pane */
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 8px 15px;
    margin-right: 2px;
}

QTabBar::tab:selected {
    background: #ffffff;
    border-color: #c8d2dc;
    border-bottom-color: #ffffff; /* make the selected tab look connected to the pane */
    font-weight: bold;
}

QGroupBox {
    border: 1px solid #c8d2dc;
    border-radius: 6px;
    margin-top: 20px;
    padding-top: 15px;
    background-color: #ffffff;
    font-weight: bold;
    color: #2c3e50; /* Dark text color */
}

QGroupBox::title {
    subcontrol-origin: margin;
    subcontrol-position: top left;
    padding: 0 10px;
    margin-left: 5px;
    background-color: #ffffff;
}

QLineEdit {
    padding: 8px;
    border: 1px solid #a0aec0;
    border-radius: 4px;
    background: #ffffff;
}

QPushButton {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    color: white;
    font-weight: 600;
}

/* Specific button styles */
#UploadButton {
    background-color: #3498db; /* Blue for primary action */
}
#UploadButton:hover {
    background-color: #2980b9;
}
#RefreshButton {
    background-color: #2ecc71; /* Green for refresh/secondary action */
}
#RefreshButton:hover {
    background-color: #27ae60;
}
#DownloadButton {
    background-color: #f39c12; /* Orange for download */
}
#DownloadButton:hover {
    background-color: #e67e22;
}

QListWidget {
    border: 1px solid #c8d2dc;
    border-radius: 4px;
    padding: 5px;
}
"""


class ChemicalApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("🧪 Chemical Equipment Visualizer (Desktop)")
        self.setGeometry(100, 100, 1000, 750) # Increased size
        self.setStyleSheet(STYLESHEET) # Apply the custom stylesheet

        # --- Main Layout with Tabs ---
        self.tabs = QTabWidget()
        self.setCentralWidget(self.tabs)

        # --- State Variables ---
        self.selected_file_path = None
        self.BASE_URL = "http://127.0.0.1:8000/api/"

        self.setup_ui()
        self.fetch_history() # Load history on startup

    def setup_ui(self):
        # --- Authentication Section (Top Bar) ---
        auth_bar = QWidget()
        auth_box = QHBoxLayout(auth_bar)
        auth_box.setContentsMargins(0, 0, 0, 0)
        
        # Title Label
        title_label = QLabel("🚀 **Backend Authentication**")
        title_label.setStyleSheet("font-size: 14px; font-weight: bold; color: #34495e;")
        auth_box.addWidget(title_label)
        auth_box.addStretch(1) # Push inputs to the right
        
        # Inputs
        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Username")
        self.username_input.setFixedWidth(150)
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Password")
        self.password_input.setEchoMode(QLineEdit.Password)
        self.password_input.setFixedWidth(150)
        
        auth_box.addWidget(QLabel("User:"))
        auth_box.addWidget(self.username_input)
        auth_box.addWidget(QLabel("Pass:"))
        auth_box.addWidget(self.password_input)
        
        # Main Layout container
        main_container = QWidget()
        main_vbox = QVBoxLayout(main_container)
        main_vbox.addWidget(auth_bar)
        main_vbox.addWidget(self.tabs)
        super().setCentralWidget(main_container) # Set the container as central widget

        # --- Tab 1: Dashboard (Upload + Charts) ---
        self.dashboard_tab = QWidget()
        self.tabs.addTab(self.dashboard_tab, "📈 Dashboard & Upload")
        self.setup_dashboard_tab()

        # --- Tab 2: History ---
        self.history_tab = QWidget()
        self.tabs.addTab(self.history_tab, "📜 History & Reports")
        self.setup_history_tab()

    # ----------------------------------------------------------------------
    # --- Dashboard Setup ---
    # ----------------------------------------------------------------------
    def setup_dashboard_tab(self):
        main_layout = QVBoxLayout(self.dashboard_tab)

        # Top Section: Upload Group Box
        upload_group = QGroupBox("⬆️ Data Upload")
        upload_box = QHBoxLayout(upload_group)
        
        # File Select
        self.select_btn = QPushButton("Select CSV File")
        self.select_btn.clicked.connect(self.select_file)
        self.select_btn.setStyleSheet("background-color: #5bc0de;")
        self.file_label = QLabel("No file selected")
        self.file_label.setStyleSheet("padding: 5px; border: 1px dashed #a0aec0; border-radius: 4px; min-width: 250px;")
        
        # Upload Button
        self.upload_btn = QPushButton("Upload & Analyze")
        self.upload_btn.setObjectName("UploadButton") # Used for QSS styling
        self.upload_btn.clicked.connect(self.upload_file)

        upload_box.addWidget(self.select_btn)
        upload_box.addWidget(self.file_label, 1) # Allow label to expand
        upload_box.addWidget(self.upload_btn)
        
        main_layout.addWidget(upload_group)

        # Bottom Section: Chart and Summary Layout (Horizontal Split)
        analysis_group = QGroupBox("📊 Analysis Results")
        analysis_split = QHBoxLayout(analysis_group)

        # 1. Matplotlib Chart Area (Left)
        self.figure = Figure(figsize=(5, 4), dpi=100)
        self.canvas = FigureCanvas(self.figure)
        analysis_split.addWidget(self.canvas, 2) # Takes 2/3rds of space

        # 2. Summary Text Area (Right)
        summary_container = QWidget()
        summary_vbox = QVBoxLayout(summary_container)
        
        self.summary_title = QLabel("Summary for Last Upload:")
        self.summary_title.setStyleSheet("font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #34495e;")
        
        self.summary_label = QLabel("Upload a file to see analysis...")
        self.summary_label.setAlignment(Qt.AlignTop | Qt.AlignLeft)
        self.summary_label.setStyleSheet("background-color: #f7f9fc; border: 1px solid #dcdcdc; padding: 15px; border-radius: 4px;")
        self.summary_label.setWordWrap(True)
        
        summary_vbox.addWidget(self.summary_title)
        summary_vbox.addWidget(self.summary_label, 1) # Takes up remaining vertical space
        
        analysis_split.addWidget(summary_container, 1) # Takes 1/3rd of space
        
        main_layout.addWidget(analysis_group, 1) # Allow analysis group to expand vertically

    # ----------------------------------------------------------------------
    # --- History Setup ---
    # ----------------------------------------------------------------------
    def setup_history_tab(self):
        main_layout = QVBoxLayout(self.history_tab)
        
        # History Group Box
        history_group = QGroupBox("🕒 Upload History & Reports")
        history_vbox = QVBoxLayout(history_group)
        
        # Refresh Button
        self.refresh_btn = QPushButton("Refresh History")
        self.refresh_btn.setObjectName("RefreshButton")
        self.refresh_btn.clicked.connect(self.fetch_history)
        history_vbox.addWidget(self.refresh_btn)

        # History List
        self.history_list = QListWidget()
        self.history_list.setSpacing(5) # Add space between items
        history_vbox.addWidget(self.history_list)
        
        main_layout.addWidget(history_group, 1)


    # ----------------------------------------------------------------------
    # --- Core Logic Methods (Unchanged Functionality) ---
    # ----------------------------------------------------------------------
    def select_file(self):
        file_path, _ = QFileDialog.getOpenFileName(self, "Select CSV", "", "CSV Files (*.csv)")
        if file_path:
            self.selected_file_path = file_path
            self.file_label.setText(f"File Selected: **{file_path.split('/')[-1]}**") 
            self.file_label.setStyleSheet("padding: 5px; border: 1px solid #3498db; border-radius: 4px; min-width: 250px; color: #34495e; font-weight: bold;")
        else:
            self.file_label.setText("No file selected")
            self.file_label.setStyleSheet("padding: 5px; border: 1px dashed #a0aec0; border-radius: 4px; min-width: 250px;")

    def get_auth(self):
        return (self.username_input.text(), self.password_input.text())

    def upload_file(self):
        username, password = self.get_auth()
        if not username or not password:
            QMessageBox.warning(self, "Authentication Error", "Please enter username and password.")
            return

        if not self.selected_file_path:
            QMessageBox.warning(self, "File Error", "Please select a CSV file first.")
            return

        url = self.BASE_URL + "upload/"
        
        try:
            # Simple UI feedback
            self.upload_btn.setText("Processing...")
            self.upload_btn.setDisabled(True)

            files = {'file': open(self.selected_file_path, 'rb')}
            response = requests.post(url, files=files, auth=(username, password))

            if response.status_code == 201:
                data = response.json()
                self.update_dashboard(data)
                self.fetch_history() # Auto-refresh history
                QMessageBox.information(self, "Success", "Data Uploaded and Analyzed Successfully!")
            else:
                QMessageBox.warning(self, "Upload Failed", f"Status: {response.status_code}\nDetails: {response.text[:200]}...")

        except Exception as e:
            QMessageBox.critical(self, "Connection Error", f"Could not connect to backend.\nDetails: {e}")
        
        finally:
            self.upload_btn.setText("Upload & Analyze")
            self.upload_btn.setDisabled(False)

    def update_dashboard(self, data):
        # 1. Update Text Summary (formatted nicely)
        summary = data.get('summary_data', {})
        averages = summary.get('averages', {})
        
        text = f"""
        **File:** {data.get('file_name', 'N/A')}
        **Total Rows:** {summary.get('total_count', 'N/A')}
        ---
        **Average Parameters:**
        Flowrate: {averages.get('Flowrate', 0):.2f} units
        Temperature: {averages.get('Temperature', 0):.2f} °C
        Pressure: {averages.get('Pressure', 0):.2f} bar
        """
        self.summary_label.setText(text.strip())
        self.summary_label.setTextFormat(Qt.MarkdownText) # Enable **bold** formatting
        
        # 2. Update Matplotlib Chart
        self.figure.clear()
        ax = self.figure.add_subplot(111)
        
        type_dist = summary.get('type_distribution', {})
        types = list(type_dist.keys())
        counts = list(type_dist.values())
        
        ax.bar(types, counts, color=['#1abc9c', '#3498db', '#9b59b6', '#f1c40f']) # Nicer colors
        ax.set_title("Equipment Type Distribution", fontsize=14)
        ax.set_ylabel("Count", fontsize=12)
        ax.set_xticklabels(types, rotation=15, ha="right")
        ax.grid(axis='y', linestyle='--', alpha=0.7)
        
        self.figure.tight_layout() # Prevent labels from overlapping
        self.canvas.draw()

    def fetch_history(self):
        username, password = self.get_auth()
        if not username: return 

        try:
            response = requests.get(self.BASE_URL + "history/", auth=(username, password))
            if response.status_code == 200:
                self.history_list.clear()
                history_data = response.json()
                
                for item in history_data:
                    # Create a customized widget for each history item for better aesthetics
                    item_widget = QWidget()
                    item_widget.setStyleSheet("background-color: #f8f9fa; border-radius: 4px; padding: 5px;")
                    
                    item_layout = QHBoxLayout(item_widget)
                    item_layout.setContentsMargins(5, 5, 5, 5)
                    
                    info_text = f"**{item.get('file_name', 'N/A')}** | Uploaded: {item.get('uploaded_at', 'N/A')[:10]}"
                    info_label = QLabel(info_text)
                    info_label.setTextFormat(Qt.MarkdownText)

                    pdf_btn = QPushButton("Download Report")
                    pdf_btn.setObjectName("DownloadButton")
                    pdf_btn.setFixedSize(QSize(150, 30))
                    # Use a lambda function to pass item details to the download function
                    pdf_btn.clicked.connect(lambda checked, i=item: self.download_pdf(i['id'], i['file_name']))
                    
                    item_layout.addWidget(info_label, 1) # Expand info label
                    item_layout.addWidget(pdf_btn)
                    
                    # Add widget to the list
                    list_item = QListWidgetItem(self.history_list)
                    list_item.setSizeHint(item_widget.sizeHint())
                    self.history_list.setItemWidget(list_item, item_widget)
                    
        except Exception as e:
            # Display a more helpful message to the user
            QMessageBox.critical(self, "History Error", f"Failed to fetch history.\nDetails: {e}")

    def download_pdf(self, id, filename):
        username, password = self.get_auth()
        if not username: return

        try:
            response = requests.get(self.BASE_URL + f"report/{id}/", auth=(username, password))
            if response.status_code == 200:
                save_path, _ = QFileDialog.getSaveFileName(self, "Save PDF Report", f"Report_{filename.replace('.csv', '')}.pdf", "PDF Files (*.pdf)")
                if save_path:
                    with open(save_path, 'wb') as f:
                        f.write(response.content)
                    QMessageBox.information(self, "Success", f"Report PDF Saved to:\n{save_path}")
            else:
                QMessageBox.warning(self, "Download Failed", f"Could not download report.\nStatus: {response.status_code}")
        except Exception as e:
             QMessageBox.critical(self, "Connection Error", str(e))

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = ChemicalApp()
    window.show()
    sys.exit(app.exec_())