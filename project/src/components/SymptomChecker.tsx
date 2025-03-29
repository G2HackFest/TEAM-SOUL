import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Search,
  AlertCircle,
  ChevronRight,
  Download,
  Plus,
  X,
  Clock,
  ThermometerSun,
  Activity,
} from 'lucide-react';
import { useStore } from '../store';
import {
  symptoms,
  type SymptomInput,
  type Condition,
  type Severity,
  analyzeSymptoms,
  generatePrescription,
} from '../lib/symptoms';
import PrescriptionPDF from './PrescriptionPDF';

export default function SymptomChecker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomInput[]>([]);
  const [analysisResults, setAnalysisResults] = useState<{
    conditions: Condition[];
    urgencyLevel: Severity;
  } | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const { currentUser } = useStore();

  // Filter symptoms based on search term
  const filteredSymptoms = symptoms.filter((symptom) =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Real-time symptom analysis
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      const results = analyzeSymptoms(selectedSymptoms);
      setAnalysisResults(results);
    } else {
      setAnalysisResults(null);
    }
  }, [selectedSymptoms]);

  const handleAddSymptom = (symptomName: typeof symptoms[number]) => {
    if (!selectedSymptoms.some((s) => s.name === symptomName)) {
      setSelectedSymptoms([
        ...selectedSymptoms,
        {
          name: symptomName,
          severity: 'moderate',
          duration: '1 day',
        },
      ]);
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleRemoveSymptom = (index: number) => {
    setSelectedSymptoms(selectedSymptoms.filter((_, i) => i !== index));
  };

  const handleUpdateSymptom = (index: number, updates: Partial<SymptomInput>) => {
    setSelectedSymptoms(
      selectedSymptoms.map((symptom, i) =>
        i === index ? { ...symptom, ...updates } : symptom
      )
    );
  };

  const handleViewPrescription = (condition: Condition) => {
    setSelectedCondition(condition);
    setShowPrescription(true);
  };

  return (
    <div className="space-y-6">
      {/* Symptom Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Symptom Checker</h2>
        <div className="relative">
          <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              placeholder="Search symptoms..."
              className="ml-2 flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowSuggestions(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Symptom Suggestions */}
          {showSuggestions && searchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
              {filteredSymptoms.length > 0 ? (
                filteredSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => handleAddSymptom(symptom)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4 text-gray-400" />
                    <span>{symptom}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No symptoms found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Symptoms */}
      {selectedSymptoms.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Selected Symptoms</h3>
          <div className="space-y-3">
            {selectedSymptoms.map((symptom, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200 gap-4"
              >
                <div className="flex items-center">
                  <ThermometerSun className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-gray-900 font-medium">{symptom.name}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={symptom.severity}
                    onChange={(e) =>
                      handleUpdateSymptom(index, {
                        severity: e.target.value as Severity,
                      })
                    }
                    className="rounded-md border-gray-300 text-sm"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>

                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={symptom.duration}
                      onChange={(e) =>
                        handleUpdateSymptom(index, { duration: e.target.value })
                      }
                      placeholder="Duration"
                      className="w-24 rounded-md border-gray-300 text-sm"
                    />
                  </div>

                  <button
                    onClick={() => handleRemoveSymptom(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResults && analysisResults.conditions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Possible Conditions</h3>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                analysisResults.urgencyLevel === 'severe'
                  ? 'bg-red-100 text-red-800'
                  : analysisResults.urgencyLevel === 'moderate'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              <Activity className="h-4 w-4 mr-2" />
              {analysisResults.urgencyLevel.charAt(0).toUpperCase() +
                analysisResults.urgencyLevel.slice(1)}{' '}
              Urgency
            </span>
          </div>

          <div className="space-y-6">
            {analysisResults.conditions.map((condition, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {condition.name}
                    </h4>
                    <p className="text-gray-600 mt-1">{condition.description}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-indigo-600">
                      {condition.probability}%
                    </span>
                    <span className="text-sm text-gray-500">match</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Matched Symptoms</h5>
                    <div className="space-y-2">
                      {condition.matchedSymptoms?.map((symptom) => (
                        <div
                          key={symptom}
                          className="flex items-center text-gray-600 bg-white rounded-lg p-2"
                        >
                          <ChevronRight className="h-4 w-4 mr-2 text-indigo-500" />
                          {symptom}
                        </div>
                      ))}
                    </div>
                  </div>

                  {condition.recommendedTests && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">
                        Recommended Tests
                      </h5>
                      <div className="space-y-2">
                        {condition.recommendedTests.map((test) => (
                          <div
                            key={test}
                            className="flex items-center text-gray-600 bg-white rounded-lg p-2"
                          >
                            <Activity className="h-4 w-4 mr-2 text-green-500" />
                            {test}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-gray-200">
                  <div className="text-sm">
                    <span className="text-gray-600">Recommended Specialist: </span>
                    <span className="font-medium text-gray-900">
                      {condition.specialization}
                    </span>
                  </div>
                  <button
                    onClick={() => handleViewPrescription(condition)}
                    className="flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100"
                  >
                    <Download className="h-5 w-5" />
                    <span>View Prescription</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {selectedSymptoms.length > 0 &&
        (!analysisResults || analysisResults.conditions.length === 0) && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No Matching Conditions
            </h3>
            <p className="mt-2 text-gray-500">
              Please add more symptoms or consult a healthcare professional for a proper diagnosis.
            </p>
          </div>
        )}

      {/* Prescription Modal */}
      {showPrescription && selectedCondition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Digital Prescription</h3>
              <button
                onClick={() => setShowPrescription(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <PrescriptionPDF
              patientName={currentUser?.name || ''}
              patientAge={30}
              symptoms={selectedSymptoms}
              diagnosis={{
                condition: selectedCondition.name,
                description: selectedCondition.description,
                severity: selectedCondition.severity,
              }}
              medications={selectedCondition.commonMedications || []}
              doctorName="Dr. AI Assistant"
              hospitalName="SwasthyaSathi Virtual Clinic"
              date={format(new Date(), 'PPP')}
              recommendations={[
                'Take medications as prescribed',
                'Get adequate rest',
                'Stay hydrated',
                'Follow up if symptoms persist or worsen',
                ...(selectedCondition.recommendedTests
                  ? [`Recommended tests: ${selectedCondition.recommendedTests.join(', ')}`]
                  : []),
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}