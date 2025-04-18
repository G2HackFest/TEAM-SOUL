import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#666',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#444',
  },
  text: {
    fontSize: 11,
    marginBottom: 3,
    color: '#333',
  },
  footer: {
    marginTop: 30,
    borderTop: 1,
    borderTopColor: '#666',
    paddingTop: 10,
  },
  disclaimer: {
    fontSize: 8,
    color: '#666',
    marginTop: 5,
  },
});

interface PrescriptionProps {
  patientName: string;
  patientAge: number;
  symptoms: {
    name: string;
    severity: string;
    duration: string;
  }[];
  diagnosis: {
    condition: string;
    description: string;
    severity: string;
  };
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  doctorName: string;
  hospitalName: string;
  date: string;
  recommendations?: string[];
}

export default function PrescriptionPDF({
  patientName,
  patientAge,
  symptoms,
  diagnosis,
  medications,
  doctorName,
  hospitalName,
  date,
  recommendations,
}: PrescriptionProps) {
  return (
    <PDFViewer style={{ width: '100%', height: '600px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{hospitalName}</Text>
            <Text style={styles.subtitle}>Medical Prescription</Text>
            <Text style={styles.subtitle}>Date: {date}</Text>
          </View>

          {/* Patient Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
            <Text style={styles.text}>Name: {patientName}</Text>
            <Text style={styles.text}>Age: {patientAge} years</Text>
          </View>

          {/* Symptoms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Symptoms</Text>
            {symptoms.map((symptom, index) => (
              <Text key={index} style={styles.text}>
                • {symptom.name} - {symptom.severity} (Duration: {symptom.duration})
              </Text>
            ))}
          </View>

          {/* Diagnosis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diagnosis</Text>
            <Text style={styles.text}>Condition: {diagnosis.condition}</Text>
            <Text style={styles.text}>Severity: {diagnosis.severity}</Text>
            <Text style={styles.text}>Description: {diagnosis.description}</Text>
          </View>

          {/* Medications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prescribed Medications</Text>
            {medications.map((med, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.text}>
                  {index + 1}. {med.name}
                </Text>
                <Text style={styles.text}>   Dosage: {med.dosage}</Text>
                <Text style={styles.text}>   Frequency: {med.frequency}</Text>
                <Text style={styles.text}>   Duration: {med.duration}</Text>
                <Text style={styles.text}>   Instructions: {med.instructions}</Text>
              </View>
            ))}
          </View>

          {/* Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Recommendations</Text>
              {recommendations.map((rec, index) => (
                <Text key={index} style={styles.text}>
                  • {rec}
                </Text>
              ))}
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.text}>Doctor: {doctorName}</Text>
            <Text style={styles.text}>Hospital: {hospitalName}</Text>
            <Text style={styles.disclaimer}>
              This is a digital prescription generated by SwasthyaSathi Healthcare System.
              Please consult with your healthcare provider for any changes or concerns.
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}