<?php
// Validasi request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method not allowed');
}

// Konfigurasi dasar
$recipient_email = 'admin@example.com'; // Ganti dengan email penerima
$redirect_url = 'thank-you.html'; // Halaman setelah submit berhasil

// Ambil dan sanitasi data
$data = [
    'nama' => htmlspecialchars($_POST['nama'] ?? '', ENT_QUOTES, 'UTF-8'),
    'email' => filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL),
    'whatsapp' => preg_replace('/[^0-9]/', '', $_POST['whatsapp'] ?? ''),
    'mainAccount' => htmlspecialchars($_POST['mainAccount'] ?? '', ENT_QUOTES, 'UTF-8'),
    'package' => filter_input(INPUT_POST, 'package', FILTER_SANITIZE_NUMBER_INT),
    'extraAccounts' => isset($_POST['extraAccounts']) ? 
        array_map(function($item) {
            return htmlspecialchars($item, ENT_QUOTES, 'UTF-8');
        }, $_POST['extraAccounts']) 
        : [],
];
// Validasi data wajib
$errors = [];
if (empty($data['nama'])) $errors[] = 'Nama lengkap harus diisi';
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) $errors[] = 'Email tidak valid';
if (!preg_match('/^08[0-9]{9,12}$/', $data['whatsapp'])) $errors[] = 'Nomor WhatsApp tidak valid';

// Jika ada error
if (!empty($errors)) {
    session_start();
    $_SESSION['form_errors'] = $errors;
    header('Location: index.html#registration');
    exit;
}

// Kirim notifikasi WhatsApp via Fonte API
$fonte_api_key = 'xxxxxxx';
$admin = 'xxxxxxx';
$whatsapp_number = $data['whatsapp'];
$message = "Halo {$data['nama']}, pendaftaran Anda telah berhasil. Terima kasih!";

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => 'https://api.fonnte.com/send',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => [
        'target' => $whatsapp_number, $admin,
        'message' => $message
    ],
    CURLOPT_HTTPHEADER => [
        "Authorization: $fonte_api_key"
    ],
]);

$response = curl_exec($curl);
if (curl_errno($curl)) {
  $error_msg = curl_error($curl);
}
curl_close($curl);

if (isset($error_msg)) {
 echo $error_msg;
}
echo $response;

exit;
