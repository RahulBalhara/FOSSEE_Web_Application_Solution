import sys
import requests
from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
                             QLabel, QLineEdit, QPushButton, QFileDialog, QMessageBox, 
                             QTabWidget, QListWidget, QListWidgetItem, QScrollArea)
from PyQt5.QtCore import Qt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

class ChemicalApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chemical Equipment Visualizer (Desktop)")
        self.setGeometry(100, 100, 900, 700)

        # Main Layout with Tabs
        self.tabs = QTabWidget()
        self.setCentralWidget(self.tabs)

        # --- Tab 1: Dashboard (Upload + Charts) ---
        self.dashboard_tab = QWidget()
        self.dashboard_layout = QVBoxLayout()
        self.dashboard_tab.setLayout(self.dashboard_layout)
        self.tabs.addTab(self.dashboard_tab, "Dashboard & Upload")

        # Authentication Section (Shared)
        auth_box = QHBoxLayout()
        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Username")
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Password")
        self.password_input.setEchoMode(QLineEdit.Password)
        auth_box.addWidget(QLabel("Auth:"))
        auth_box.addWidget(self.username_input)
        auth_box.addWidget(self.password_input)
        self.dashboard_layout.addLayout(auth_box)

        # File Upload Section
        upload_box = QHBoxLayout()
        self.file_label = QLabel("No file selected")
        self.select_btn = QPushButton("Select CSV")
        self.select_btn.clicked.connect(self.select_file)
        self.upload_btn = QPushButton("Upload & Analyze")
        self.upload_btn.clicked.connect(self.upload_file)
        self.upload_btn.setStyleSheet("background-color: #4CAF50; color: white; font-weight: bold;")
        
        upload_box.addWidget(self.select_btn)
        upload_box.addWidget(self.file_label)
        upload_box.addWidget(self.upload_btn)
        self.dashboard_layout.addLayout(upload_box)

        # Matplotlib Chart Area
        self.figure = Figure(figsize=(5, 4), dpi=100)
        self.canvas = FigureCanvas(self.figure)
        self.dashboard_layout.addWidget(self.canvas)

        # Summary Text Area
        self.summary_label = QLabel("Upload a file to see analysis...")
        self.summary_label.setAlignment(Qt.AlignCenter)
        self.dashboard_layout.addWidget(self.summary_label)

        # --- Tab 2: History ---
        self.history_tab = QWidget()
        self.history_layout = QVBoxLayout()
        self.history_tab.setLayout(self.history_layout)
        self.tabs.addTab(self.history_tab, "History & Reports")

        self.refresh_btn = QPushButton("Refresh History")
        self.refresh_btn.clicked.connect(self.fetch_history)
        self.history_layout.addWidget(self.refresh_btn)

        self.history_list = QListWidget()
        self.history_layout.addWidget(self.history_list)

        self.selected_file_path = None

    def select_file(self):
        file_path, _ = QFileDialog.getOpenFileName(self, "Select CSV", "", "CSV Files (*.csv)")
        if file_path:
            self.selected_file_path = file_path
            self.file_label.setText(file_path.split("/")[-1]) # Show only filename

    def get_auth(self):
        return (self.username_input.text(), self.password_input.text())

    def upload_file(self):
        username, password = self.get_auth()
        if not username or not password:
            QMessageBox.warning(self, "Error", "Please enter username and password.")
            return

        if not self.selected_file_path:
            QMessageBox.warning(self, "Error", "Please select a CSV file first.")
            return

        url = "http://127.0.0.1:8000/api/upload/"
        
        try:
            files = {'file': open(self.selected_file_path, 'rb')}
            response = requests.post(url, files=files, auth=(username, password))

            if response.status_code == 201:
                data = response.json()
                self.update_dashboard(data)
                self.fetch_history() # Auto-refresh history
                QMessageBox.information(self, "Success", "Upload Successful!")
            else:
                QMessageBox.warning(self, "Upload Failed", response.text)

        except Exception as e:
            QMessageBox.critical(self, "Connection Error", str(e))

    def update_dashboard(self, data):
        # 1. Update Text Summary
        # summary = data['summary_data']
        # text = (f"Total Count: {summary['total_count']}  |  "
        #         f"Avg Flowrate: {summary['averages']['Flowrate']:.2f}")
        summary = data['summary_data']
        text = (f"Total Count: {summary['total_count']} | "
        f"Avg Flowrate: {summary['averages']['Flowrate']:.2f} | "
        f"Avg Temp: {summary['averages']['Temperature']:.2f} | "
        f"Avg Pressure: {summary['averages']['Pressure']:.2f}")
        self.summary_label.setText(text)
        self.summary_label.setStyleSheet("font-size: 14px; font-weight: bold; padding: 10px;")

        # 2. Update Matplotlib Chart
        self.figure.clear()
        ax = self.figure.add_subplot(111)
        
        types = list(summary['type_distribution'].keys())
        counts = list(summary['type_distribution'].values())
        
        ax.bar(types, counts, color='skyblue')
        ax.set_title("Equipment Type Distribution")
        ax.set_ylabel("Count")
        
        self.canvas.draw()

    def fetch_history(self):
        username, password = self.get_auth()
        if not username: return 

        try:
            response = requests.get("http://127.0.0.1:8000/api/history/", auth=(username, password))
            if response.status_code == 200:
                self.history_list.clear()
                history_data = response.json()
                
                for item in history_data:
                    # Create a widget for each history item
                    item_widget = QWidget()
                    item_layout = QHBoxLayout()
                    
                    info_label = QLabel(f"{item['file_name']} ({item['uploaded_at'][:10]})")
                    pdf_btn = QPushButton("Download PDF")
                    pdf_btn.clicked.connect(lambda checked, i=item: self.download_pdf(i['id'], i['file_name']))
                    
                    item_layout.addWidget(info_label)
                    item_layout.addWidget(pdf_btn)
                    item_widget.setLayout(item_layout)
                    
                    # Add widget to the list
                    list_item = QListWidgetItem(self.history_list)
                    list_item.setSizeHint(item_widget.sizeHint())
                    self.history_list.setItemWidget(list_item, item_widget)
                    
        except Exception as e:
            print(f"Error fetching history: {e}")

    def download_pdf(self, id, filename):
        username, password = self.get_auth()
        try:
            response = requests.get(f"http://127.0.0.1:8000/api/report/{id}/", auth=(username, password))
            if response.status_code == 200:
                save_path, _ = QFileDialog.getSaveFileName(self, "Save PDF", f"Report_{filename}.pdf", "PDF Files (*.pdf)")
                if save_path:
                    with open(save_path, 'wb') as f:
                        f.write(response.content)
                    QMessageBox.information(self, "Success", f"PDF Saved to {save_path}")
            else:
                QMessageBox.warning(self, "Error", "Could not download report.")
        except Exception as e:
             QMessageBox.critical(self, "Error", str(e))

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = ChemicalApp()
    window.show()
    sys.exit(app.exec_())