import { useState } from 'react'

function App() {
  // --- Data Model Section ---
  // hospitalStaff stores all our doctor objects [cite: 22]
  const [hospitalStaff, setHospitalStaff] = useState([]); 
  // systemMessage handles success or error alerts in the Output Display Panel [cite: 37]
  const [systemMessage, setSystemMessage] = useState(""); 
  
  // --- Input Field States ---
  const [newDoctorId, setNewDoctorId] = useState("");
  const [specialtyArea, setSpecialtyArea] = useState("");
  const [maxDailyLimit, setMaxDailyLimit] = useState("");
  const [patientSearchSpecialty, setPatientSearchSpecialty] = useState("");

  // 1. Functional Requirement: Add Doctor [cite: 24, 25]
  const handleRegisterDoctor = (e) => {
    e.preventDefault();
    
    // Check if the user missed any input fields [cite: 15]
    if (!newDoctorId || !specialtyArea || !maxDailyLimit) {
      setSystemMessage("Wait! Please fill in the ID, Specialty, and Patient Limit.");
      return;
    }

    // Creating the doctor object based on the required fields [cite: 22]
    const newDoctorProfile = {
      doctorId: newDoctorId,
      specialization: specialtyArea,
      maxDailyPatients: parseInt(maxDailyLimit),
      currentAppointments: 0 // New doctors start with no appointments
    };

    // Add this new doctor to our list and reset the form
    setHospitalStaff([...hospitalStaff, newDoctorProfile]);
    setSystemMessage(`Success: Dr. ${newDoctorId} has been added to the system.`);
    setNewDoctorId(""); setSpecialtyArea(""); setMaxDailyLimit("");
  };

  // 3. Functional Requirement: Book Appointment Logic [cite: 28, 29]
  const executeFairBooking = () => {
    // a. First, find all doctors who match the specialty the patient is looking for
    const matchingSpecialists = hospitalStaff.filter(doc => 
      doc.specialization.toLowerCase() === patientSearchSpecialty.toLowerCase()
    );

    if (matchingSpecialists.length === 0) {
      setSystemMessage("Error: We don't have any doctors for that specialty.");
      return;
    }

    // b. Of those specialists, find who actually has room left 
    const availableDoctors = matchingSpecialists.filter(doc => 
      doc.currentAppointments < doc.maxDailyPatients
    );

    if (availableDoctors.length === 0) {
      // If everyone is full, we must reject the booking 
      setSystemMessage("Rejected: All doctors in this department are fully booked.");
      return;
    }

    // c. Logic: Find the doctor with the fewest appointments to keep things fair 
    const doctorWithLeastWorkload = availableDoctors.reduce((bestChoice, currentDoc) => 
      currentDoc.currentAppointments < bestChoice.currentAppointments ? currentDoc : bestChoice
    );

    // Update the master list: Find the chosen doctor and increment their appointment count
    const updatedStaffList = hospitalStaff.map(doc => 
      doc.doctorId === doctorWithLeastWorkload.doctorId 
      ? { ...doc, currentAppointments: doc.currentAppointments + 1 } 
      : doc
    );

    setHospitalStaff(updatedStaffList);
    setSystemMessage(`Confirmed: Appointment assigned to Dr. ${doctorWithLeastWorkload.doctorId}`);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Hospital Appointment Scheduler</h1>

      {/* Mandatory UI: Add Doctor form [cite: 34] */}
      <section style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
        <h3>Register a New Doctor</h3>
        <form onSubmit={handleRegisterDoctor} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input placeholder="Doctor ID" value={newDoctorId} onChange={(e) => setNewDoctorId(e.target.value)} />
          <input placeholder="Specialization" value={specialtyArea} onChange={(e) => setSpecialtyArea(e.target.value)} />
          <input placeholder="Daily Patient Limit" type="number" value={maxDailyLimit} onChange={(e) => setMaxDailyLimit(e.target.value)} />
          <button type="submit" style={{ cursor: 'pointer', padding: '8px 15px' }}>Add Doctor</button>
        </form>
      </section>

      {/* Mandatory UI: Appointment booking screen [cite: 36] */}
      <section style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', marginBottom: '20px', backgroundColor: '#fff' }}>
        <h3>Book an Appointment</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input placeholder="What specialty do you need?" value={patientSearchSpecialty} onChange={(e) => setPatientSearchSpecialty(e.target.value)} />
          <button onClick={executeFairBooking} style={{ cursor: 'pointer', backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px' }}>
            Find Best Doctor
          </button>
        </div>
      </section>

      {/* Mandatory UI: Output display panel [cite: 37] */}
      <div style={{ background: '#e8f4fd', padding: '15px', borderRadius: '8px', borderLeft: '6px solid #3498db', marginBottom: '20px' }}>
        <strong>System Status:</strong> {systemMessage || "..."}
      </div>

      {/* Mandatory UI: Doctor listing screen [cite: 35] */}
      <section>
        <h3>Current Doctor Workloads [cite: 26, 27]</h3>
        <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#ecf0f1' }}>
            <tr>
              <th style={{ padding: '10px' }}>Doctor ID</th>
              <th style={{ padding: '10px' }}>Specialty</th>
              <th style={{ padding: '10px' }}>Capacity</th>
              <th style={{ padding: '10px' }}>Booked Appointments</th>
            </tr>
          </thead>
          <tbody>
            {hospitalStaff.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No doctors registered in the system yet.</td></tr>
            ) : (
              hospitalStaff.map(doc => (
                <tr key={doc.doctorId}>
                  <td style={{ padding: '10px' }}>{doc.doctorId}</td>
                  <td style={{ padding: '10px' }}>{doc.specialization}</td>
                  <td style={{ padding: '10px' }}>{doc.maxDailyPatients}</td>
                  <td style={{ padding: '10px' }}>{doc.currentAppointments}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default App