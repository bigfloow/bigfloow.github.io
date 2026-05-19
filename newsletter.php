<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration - MODIFIEZ CES INFOS
$admin_email = "bigfloow0@gmail.com"; // Votre email pour recevoir les notifications
$csv_file = "abonnes.csv";

// Récupérer l'email envoyé
$data = json_decode(file_get_contents('php://input'), true);
$email = isset($data['email']) ? trim($data['email']) : '';

// Vérification de l'email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

// Vérifier si le fichier CSV existe, sinon le créer avec les en-têtes
if (!file_exists($csv_file)) {
    $file = fopen($csv_file, 'w');
    fputcsv($file, ['Email', 'Date_inscription', 'IP']);
    fclose($file);
}

// Vérifier si l'email existe déjà
$existing_emails = [];
if (($handle = fopen($csv_file, 'r')) !== false) {
    while (($row = fgetcsv($handle)) !== false) {
        if (isset($row[0]) && $row[0] == $email) {
            $existing_emails[] = $email;
        }
    }
    fclose($handle);
}

if (in_array($email, $existing_emails)) {
    echo json_encode(['success' => false, 'message' => 'Cet email est déjà inscrit à notre newsletter !']);
    exit;
}

// Ajouter le nouvel email
$file = fopen($csv_file, 'a');
$ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'Inconnu';
$date = date('Y-m-d H:i:s');
fputcsv($file, [$email, $date, $ip_address]);
fclose($file);

// Envoyer une notification par email à l'administrateur
$subject = "📧 Nouvel abonné à la newsletter BiG FlooW";
$message = "
<html>
<head>
    <title>Nouvel abonné</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .card { background: white; border-radius: 12px; padding: 25px; max-width: 500px; margin: 0 auto; border-left: 4px solid #ED7F10; }
        h2 { color: #ED7F10; margin-top: 0; }
        .info { margin: 20px 0; }
        .info p { margin: 8px 0; }
        .footer { font-size: 12px; color: #888; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px; }
    </style>
</head>
<body>
    <div class='card'>
        <h2>🎉 Nouvel abonné</h2>
        <div class='info'>
            <p><strong>📧 Email :</strong> {$email}</p>
            <p><strong>📅 Date :</strong> {$date}</p>
            <p><strong>🌐 IP :</strong> {$ip_address}</p>
        </div>
        <div class='footer'>
            <p>BiG FlooW - Agence de Design Graphique</p>
        </div>
    </div>
</body>
</html>
";

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: BiG FlooW Newsletter <noreply@bigfloow.com>" . "\r\n";

mail($admin_email, $subject, $message, $headers);

// Retourner une réponse de succès
echo json_encode(['success' => true, 'message' => 'Merci de votre abonnement 😊 Vous serez informé de nos prochaines actualités !']);
?>
