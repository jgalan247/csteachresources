/**
 * Certificate Generation System
 * Creates PDF certificates when students complete modules
 * Stores certificates for teacher inspection
 */

const CertificateSystem = {
    STORAGE_KEY: 'python_learning_certificates',
    STUDENT_KEY: 'python_learning_student',

    // Topic display names
    topicNames: {
        'variables': 'Variables',
        'operators': 'Arithmetic Operators',
        'data-types': 'Data Types',
        'selection': 'Selection',
        'for-loops': 'For Loops',
        'while-loops': 'While Loops',
        'lists': 'Lists',
        'arrays-1d': '1D Arrays (Lists)',
        'arrays-2d': '2D Arrays (Grids)',
        'strings': 'String Manipulation',
        'functions': 'Functions',
        'errors': 'Common Errors',
        'file-handling': 'File Handling',
        'validation': 'Input Validation',
        'sql': 'SQL & Databases',
        'cpu': 'CPU & Fetch-Execute Cycle',
        'memory': 'Memory & Storage',
        'storage': 'Secondary Storage',
        'units': 'Data Units & Capacity',
        'numbers': 'Number Systems',
        'representation': 'Data Representation',
        'compression': 'Compression',
        'networks': 'Computer Networks',
        'protocols': 'Protocols & Layers',
        'security': 'Network Security',
        'prevention': 'Preventing Vulnerabilities',
        'operating-systems': 'Operating Systems',
        'utility-software': 'Utility Software'
    },

    /**
     * Get stored student info
     */
    getStudent() {
        const data = localStorage.getItem(this.STUDENT_KEY);
        return data ? JSON.parse(data) : null;
    },

    /**
     * Save student info
     */
    saveStudent(name, className = '') {
        const student = {
            name: name.trim(),
            className: className.trim(),
            registeredAt: new Date().toISOString()
        };
        localStorage.setItem(this.STUDENT_KEY, JSON.stringify(student));
        return student;
    },

    /**
     * Get all certificates
     */
    getAllCertificates() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Save certificates
     */
    saveCertificates(certificates) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(certificates));
    },

    /**
     * Check if certificate exists for topic
     */
    hasCertificate(topicId) {
        const certificates = this.getAllCertificates();
        return certificates.some(cert => cert.topicId === topicId);
    },

    /**
     * Create and store a certificate
     */
    createCertificate(topicId) {
        const student = this.getStudent();
        if (!student) {
            throw new Error('No student registered');
        }

        const topicName = this.topicNames[topicId] || topicId;
        const certificate = {
            id: `cert-${topicId}-${Date.now()}`,
            studentName: student.name,
            studentClass: student.className,
            topicId: topicId,
            topicName: topicName,
            completedAt: new Date().toISOString(),
            verified: true
        };

        const certificates = this.getAllCertificates();
        // Remove any existing certificate for this topic
        const filtered = certificates.filter(c => c.topicId !== topicId);
        filtered.push(certificate);
        this.saveCertificates(filtered);

        return certificate;
    },

    /**
     * Generate PDF certificate
     */
    generatePDF(certificate) {
        // Create a new jsPDF instance (landscape A4)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Background color
        doc.setFillColor(250, 250, 252);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Border
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(3);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

        // Inner border
        doc.setDrawColor(147, 197, 253);
        doc.setLineWidth(1);
        doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

        // Decorative corners
        doc.setFillColor(59, 130, 246);
        this.drawCornerDecoration(doc, 20, 20);
        this.drawCornerDecoration(doc, pageWidth - 20, 20, true);
        this.drawCornerDecoration(doc, 20, pageHeight - 20, false, true);
        this.drawCornerDecoration(doc, pageWidth - 20, pageHeight - 20, true, true);

        // Python logo emoji (as text)
        doc.setFontSize(40);
        doc.text('🐍', pageWidth / 2, 35, { align: 'center' });

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(36);
        doc.setTextColor(30, 64, 175);
        doc.text('Certificate of Completion', pageWidth / 2, 55, { align: 'center' });

        // Subtitle
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(100, 116, 139);
        doc.text('Python Learning - Evidence-Based Programming Education', pageWidth / 2, 65, { align: 'center' });

        // Divider line
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.5);
        doc.line(60, 72, pageWidth - 60, 72);

        // "This is to certify that"
        doc.setFontSize(14);
        doc.setTextColor(71, 85, 105);
        doc.text('This is to certify that', pageWidth / 2, 85, { align: 'center' });

        // Student name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(28);
        doc.setTextColor(30, 41, 59);
        doc.text(certificate.studentName, pageWidth / 2, 100, { align: 'center' });

        // Class (if provided)
        if (certificate.studentClass) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.setTextColor(100, 116, 139);
            doc.text(`Class: ${certificate.studentClass}`, pageWidth / 2, 110, { align: 'center' });
        }

        // "has successfully completed"
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(71, 85, 105);
        doc.text('has successfully completed the module', pageWidth / 2, 122, { align: 'center' });

        // Topic name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(59, 130, 246);
        doc.text(certificate.topicName, pageWidth / 2, 138, { align: 'center' });

        // Completion date
        const completedDate = new Date(certificate.completedAt);
        const dateStr = completedDate.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139);
        doc.text(`Completed on ${dateStr}`, pageWidth / 2, 152, { align: 'center' });

        // Certificate ID (for verification)
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.text(`Certificate ID: ${certificate.id}`, pageWidth / 2, pageHeight - 25, { align: 'center' });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text('Built on evidence-based teaching methods from computing education research', pageWidth / 2, pageHeight - 18, { align: 'center' });

        return doc;
    },

    /**
     * Draw corner decoration
     */
    drawCornerDecoration(doc, x, y, flipX = false, flipY = false) {
        const size = 8;
        const dx = flipX ? -1 : 1;
        const dy = flipY ? -1 : 1;

        doc.circle(x, y, 2, 'F');
        doc.setLineWidth(1);
        doc.line(x, y, x + (size * dx), y);
        doc.line(x, y, x, y + (size * dy));
    },

    /**
     * Download certificate as PDF
     */
    downloadCertificate(certificate) {
        const doc = this.generatePDF(certificate);
        const filename = `Certificate_${certificate.topicName.replace(/\s+/g, '_')}_${certificate.studentName.replace(/\s+/g, '_')}.pdf`;
        doc.save(filename);
    },

    /**
     * Check if topic is complete and eligible for certificate
     */
    isTopicComplete(topicId) {
        const progress = Progress.getTopicProgress(topicId);
        // Consider complete if 100% or at least 4 activities completed
        return progress.progress >= 100 || (progress.completed >= 4 && progress.total > 0);
    },

    /**
     * Show certificate modal
     */
    showCertificateModal(topicId) {
        const student = this.getStudent();
        const hasCert = this.hasCertificate(topicId);
        const topicName = this.topicNames[topicId] || topicId;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'certificate-modal';
        modal.innerHTML = `
            <div class="certificate-modal-content">
                <button class="modal-close" onclick="this.closest('.certificate-modal').remove()">&times;</button>

                ${!student ? `
                    <div class="modal-section">
                        <h2>🎉 Congratulations!</h2>
                        <p>You've completed the <strong>${topicName}</strong> module!</p>
                        <p>Enter your details to claim your certificate:</p>

                        <form id="student-form" class="student-form">
                            <div class="form-group">
                                <label for="student-name">Your Name *</label>
                                <input type="text" id="student-name" required placeholder="Enter your full name">
                            </div>
                            <div class="form-group">
                                <label for="student-class">Class/Form (optional)</label>
                                <input type="text" id="student-class" placeholder="e.g., 9A, Year 10">
                            </div>
                            <button type="submit" class="btn btn-primary">Generate Certificate</button>
                        </form>
                    </div>
                ` : hasCert ? `
                    <div class="modal-section">
                        <h2>🏆 Certificate Ready!</h2>
                        <p>Your certificate for <strong>${topicName}</strong> is ready.</p>
                        <p>Student: <strong>${student.name}</strong></p>
                        ${student.className ? `<p>Class: <strong>${student.className}</strong></p>` : ''}

                        <div class="certificate-actions">
                            <button class="btn btn-primary" onclick="CertificateSystem.downloadExistingCertificate('${topicId}')">
                                📥 Download Certificate
                            </button>
                            <button class="btn btn-secondary" onclick="CertificateSystem.regenerateCertificate('${topicId}')">
                                🔄 Regenerate
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="modal-section">
                        <h2>🎉 Congratulations!</h2>
                        <p>You've completed the <strong>${topicName}</strong> module!</p>
                        <p>Student: <strong>${student.name}</strong></p>
                        ${student.className ? `<p>Class: <strong>${student.className}</strong></p>` : ''}

                        <div class="certificate-actions">
                            <button class="btn btn-primary" onclick="CertificateSystem.claimCertificate('${topicId}')">
                                🎓 Claim Your Certificate
                            </button>
                        </div>
                    </div>
                `}
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        const form = modal.querySelector('#student-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('student-name').value;
                const className = document.getElementById('student-class').value;
                this.saveStudent(name, className);
                modal.remove();
                this.claimCertificate(topicId);
            });
        }
    },

    /**
     * Claim a new certificate
     */
    claimCertificate(topicId) {
        const certificate = this.createCertificate(topicId);
        this.downloadCertificate(certificate);
        this.showSuccessMessage(certificate);
    },

    /**
     * Download existing certificate
     */
    downloadExistingCertificate(topicId) {
        const certificates = this.getAllCertificates();
        const certificate = certificates.find(c => c.topicId === topicId);
        if (certificate) {
            this.downloadCertificate(certificate);
        }
        // Close modal
        document.querySelector('.certificate-modal')?.remove();
    },

    /**
     * Regenerate certificate with current student info
     */
    regenerateCertificate(topicId) {
        const certificate = this.createCertificate(topicId);
        this.downloadCertificate(certificate);
        document.querySelector('.certificate-modal')?.remove();
        this.showSuccessMessage(certificate);
    },

    /**
     * Show success message
     */
    showSuccessMessage(certificate) {
        const toast = document.createElement('div');
        toast.className = 'certificate-toast';
        toast.innerHTML = `
            <span class="toast-icon">🎓</span>
            <span class="toast-message">Certificate for "${certificate.topicName}" downloaded!</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Export all certificates as JSON (for teacher backup)
     */
    exportAllCertificates() {
        const student = this.getStudent();
        const certificates = this.getAllCertificates();
        return JSON.stringify({
            student,
            certificates,
            exportedAt: new Date().toISOString()
        }, null, 2);
    },

    /**
     * Get summary for teacher inspection
     */
    getSummary() {
        const student = this.getStudent();
        const certificates = this.getAllCertificates();
        return {
            student,
            certificates,
            totalModulesCompleted: certificates.length,
            lastCompleted: certificates.length > 0
                ? certificates.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0]
                : null
        };
    },

    /**
     * Clear student data (for new student)
     */
    clearStudent() {
        localStorage.removeItem(this.STUDENT_KEY);
        localStorage.removeItem(this.STORAGE_KEY);
    }
};

// Add certificate button to topic pages when complete
function addCertificateButton() {
    const topicHeader = document.querySelector('.topic-header');
    if (!topicHeader) return;

    // Get topic ID from URL
    const pathParts = window.location.pathname.split('/');
    const topicIndex = pathParts.indexOf('topics');
    if (topicIndex === -1 || topicIndex >= pathParts.length - 1) return;

    const topicId = pathParts[topicIndex + 1];
    if (!topicId || topicId === 'index.html') return;

    // Check if topic is complete
    if (CertificateSystem.isTopicComplete(topicId)) {
        const certButton = document.createElement('div');
        certButton.className = 'certificate-available';
        certButton.innerHTML = `
            <div class="cert-badge">
                <span class="cert-icon">🎓</span>
                <span class="cert-text">Module Complete!</span>
            </div>
            <button class="btn btn-success" onclick="CertificateSystem.showCertificateModal('${topicId}')">
                Claim Certificate
            </button>
        `;
        topicHeader.appendChild(certButton);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Only add certificate button if jsPDF is loaded
    if (typeof window.jspdf !== 'undefined') {
        addCertificateButton();
    }
});

// Export for global access
window.CertificateSystem = CertificateSystem;
