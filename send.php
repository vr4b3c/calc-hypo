<?php
/**
 * Mortgage Calculator Form Handler
 * Receives JSON POST data and sends email notification
 */

// Set content type to JSON
header('Content-Type: application/json');

// Allow CORS if needed (adjust as necessary for production)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate data
if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

// Validate required fields
$requiredFields = ['propertyType', 'propertyValue', 'loanAmount', 'durationYears', 'monthlyPayment', 'name', 'email', 'phone', 'zip'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Configuration - Change this to your email address
$toEmail = 'info@example.com'; // CHANGE THIS TO YOUR EMAIL
$subject = 'Nová poptávka z hypoteční kalkulačky';

// Build email message
$message = buildEmailMessage($data);

// Email headers
$headers = [
    'From: noreply@yourdomain.com', // CHANGE THIS TO YOUR DOMAIN
    'Reply-To: ' . $data['email'],
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/html; charset=UTF-8'
];

// Send email
$mailSent = mail($toEmail, $subject, $message, implode("\r\n", $headers));

// Return response
if ($mailSent) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email']);
}

/**
 * Build HTML email message from form data
 */
function buildEmailMessage($data) {
    // Map property types to Czech labels
    $propertyTypeLabels = [
        'byt' => 'Byt',
        'pozemek' => 'Pozemek',
        'rodinny-dum' => 'Rodinný dům',
        'chata-chalupa' => 'Chata/chalupa',
        'bytovy-dum' => 'Bytový dům'
    ];
    
    $propertyTypeLabel = isset($propertyTypeLabels[$data['propertyType']]) 
        ? $propertyTypeLabels[$data['propertyType']] 
        : $data['propertyType'];
    
    // Format numbers
    $propertyValue = number_format($data['propertyValue'], 0, ',', ' ');
    $loanAmount = number_format($data['loanAmount'], 0, ',', ' ');
    $monthlyPayment = number_format($data['monthlyPayment'], 0, ',', ' ');
    $loanPercent = isset($data['loanPercent']) ? number_format($data['loanPercent'], 1) : 'N/A';
    
    // Build HTML email
    $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px; }
        h2 { color: #0066cc; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        td { padding: 8px; border-bottom: 1px solid #ddd; }
        td:first-child { font-weight: bold; width: 40%; }
        .highlight { background-color: #f0f8ff; padding: 15px; border-left: 4px solid #0066cc; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Nová poptávka z hypoteční kalkulačky</h1>
        
        <h2>Parametry hypotéky</h2>
        <table>
            <tr>
                <td>Typ nemovitosti:</td>
                <td>' . htmlspecialchars($propertyTypeLabel) . '</td>
            </tr>
            <tr>
                <td>Hodnota nemovitosti:</td>
                <td>' . htmlspecialchars($propertyValue) . ' Kč</td>
            </tr>
            <tr>
                <td>Procento úvěru:</td>
                <td>' . htmlspecialchars($loanPercent) . ' %</td>
            </tr>
            <tr>
                <td>Výše úvěru:</td>
                <td>' . htmlspecialchars($loanAmount) . ' Kč</td>
            </tr>
            <tr>
                <td>Délka splácení:</td>
                <td>' . htmlspecialchars($data['durationYears']) . ' let</td>
            </tr>
        </table>
        
        <div class="highlight">
            <strong>Odhadovaná měsíční splátka:</strong><br>
            <span style="font-size: 24px; color: #0066cc;">' . htmlspecialchars($monthlyPayment) . ' Kč</span>
        </div>
        
        <h2>Kontaktní údaje</h2>
        <table>
            <tr>
                <td>Jméno:</td>
                <td>' . htmlspecialchars($data['name']) . '</td>
            </tr>
            <tr>
                <td>E-mail:</td>
                <td><a href="mailto:' . htmlspecialchars($data['email']) . '">' . htmlspecialchars($data['email']) . '</a></td>
            </tr>
            <tr>
                <td>Telefon:</td>
                <td><a href="tel:' . htmlspecialchars($data['phone']) . '">' . htmlspecialchars($data['phone']) . '</a></td>
            </tr>
            <tr>
                <td>PSČ:</td>
                <td>' . htmlspecialchars($data['zip']) . '</td>
            </tr>
        </table>
        
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            Tento e-mail byl odeslán z hypoteční kalkulačky na vašem webu.
        </p>
    </div>
</body>
</html>';
    
    return $html;
}
?>
