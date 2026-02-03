import { useState } from 'react'

function App() {
  // Data Model [cite: 21, 22]
  const [doctors, setDoctors] = useState([]);
  const [output, setOutput] = useState("");
  
  // Form States
  const [docId, setDocId] = useState("");
  const [spec, setSpec] = useState("");
  const [maxP, setMaxP] = useState("");
  const [bookSpec, setBookSpec] = useState("");

  // 1. Mandatory Requirement: Add Doctor [cite: 24, 25]
  const addDoctor = (e) => {
    e.preventDefault();
    // Error Handling: Handle invalid/empty inputs [cite: 15]
    if (!docId || !spec || !maxP || maxP <= 0) {
      setOutput("Error: Please provide valid doctor details.");
      return;
    }
    const newDoc = {
      doctorId: docId,
      specialization: spec,
      maxDailyPatients: parseInt(maxP),
      currentAppointments: 0
    };
    setDoctors([...doctors, newDoc]);
    setOutput(`Doctor ${docId} added successfully.`);
    setDocId(""); setSpec(""); setMaxP("");
  };

  // 3. Mandatory Requirement: Book Appointment Logic [cite: 28, 29]
  const bookAppointment = () => {
    // a. Filter doctors by requested specialization [cite: 29]
    const matchingDocs = doctors.filter(d => 
      d.specialization.toLowerCase() === bookSpec.toLowerCase()
    );

    if (matchingDocs.length === 0) {
      setOutput("Error: No doctors found for this specialization.");
      return;
    }

    // b. Filter for doctors who are NOT full [cite: 32]
    const availableDocs = matchingDocs.filter(d => d.currentAppointments < d.maxDailyPatients);

    if (availableDocs.length === 0) {
      // Reject if all doctors are full [cite: 32]
      setOutput("Error: All doctors for this specialization are full.");
      return;
    }

    // c. Allocate doctor with the fewest current appointments [cite: 31]
    const bestDoc = availableDocs.reduce((prev, curr) => 
      prev.currentAppointments < curr.currentAppointments ? prev : curr
    );

    // Update the state correctly using map
    const updatedDoctors = doctors.map(d => 
      d.doctorId === bestDoc.doctorId 
      ? { ...d, currentAppointments: d.currentAppointments + 1 } 
      : d
    );

    setDoctors(updatedDoctors);
    setOutput(`Success: Assigned to Doctor ID: ${bestDoc.doctorId}`);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>Hospital Appointment Scheduler</h1>

      {/* Mandatory UI: Add Doctor form [cite: 34] */}
      <section style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px' }}>
        <h3>Add Doctor</h3>
        <form onSubmit={addDoctor}>
          <input placeholder="ID" value={docId} onChange={(e) => setDocId(e.target.value)} style={{marginRight: '5px'}} />
          <input placeholder="Specialization" value={spec} onChange={(e) => setSpec(e.target.value)} style={{marginRight: '5px'}} />
          <input placeholder="Max Patients" type="number" value={maxP} onChange={(e) => setMaxP(e.target.value)} style={{marginRight: '5px'}} />
          <button type="submit">Add Doctor</button>
        </form>
      </section>

      {/* Mandatory UI: Appointment booking screen [cite: 36] */}
      <section style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px' }}>
        <h3>Book Appointment</h3>
        <input placeholder="Specialization" value={bookSpec} onChange={(e) => setBookSpec(e.target.value)} style={{marginRight: '5px'}} />
        <button onClick={bookAppointment}>Book Appointment</button>
      </section>

      {/* Mandatory UI: Output display panel [cite: 37] */}
      <div style={{ background: '#f9f9f9', padding: '10px', borderLeft: '4px solid blue', marginBottom: '20px' }}>
        <strong>Output:</strong> {output}
      </div>

      {/* Mandatory UI: Doctor listing screen [cite: 27, 35] */}
      <section>
        <h3>Registered Doctors</h3>
        <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Specialization</th>
              <th>Max Patients</th>
              <th>Current Appointments</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d.doctorId}>
                <td>{d.doctorId}</td>
                <td>{d.specialization}</td>
                <td>{d.maxDailyPatients}</td>
                <td>{d.currentAppointments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default App