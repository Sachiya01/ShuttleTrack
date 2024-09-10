<?php
// MySQL database credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vehicle_track";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch data
$sql = "SELECT V_ID, Longitude, Latitude FROM vehicle_loc";
$result = $conn->query($sql);

// Fetch data and store in an array
$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

$conn->close();

// Return data as JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
