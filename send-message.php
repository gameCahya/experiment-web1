<?php
// Pastikan tidak ada output sebelum header
if (ob_get_level()) ob_clean();
header('Content-Type: application/json');

// Konfigurasi API Fonnte
$fonnte_api_key = 'Du1Z92a8Km6Adyoe2xrcP6N9a7LuDkSZ92z1'; // Ganti dengan API key Fonnte Anda
$admin_number = '6289513366789'; // Ganti dengan nomor admin tujuan

// Ambil data dari form
try {
    // Validasi input
    $required = ['nama', 'email', 'whatsapp', 'mainAccount', 'package'];
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("Field $field harus diisi");
        }
    }

    // Proses data
    $data = [
        'nama' => filter_var($_POST['nama'], FILTER_SANITIZE_STRING),
        'email' => filter_var($_POST['email'], FILTER_SANITIZE_EMAIL),
        'whatsapp' => filter_var($_POST['whatsapp'], FILTER_SANITIZE_STRING),
        'mainAccount' => filter_var($_POST['mainAccount'], FILTER_SANITIZE_STRING),
        'package' => filter_var($_POST['package'], FILTER_SANITIZE_STRING),
        'total' => filter_var($_POST['total'], FILTER_SANITIZE_STRING),
        'extraAccounts' => $_POST['extraAccounts'] ?? []
    ];

// Format pesan untuk admin
$message = "📝 *PENDAFTARAN BARU* 📝\n\n"
    . "Nama: $nama\n"
    . "Email: $email\n"
    . "WhatsApp: $whatsapp\n"
    . "Akun Utama: @$main_account\n"
    . "Paket: " . getPackageName($package) . "\n"
    . "Akun Tambahan: " . (count($extra_accounts) > 0 ? implode(', ', $extra_accounts) : 'Tidak ada') . "\n"
    . "Total Tagihan: $total\n\n"
    . "Segera konfirmasi pembayaran!";

// Kirim ke API Fonnte
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
        'target' => $admin_number,$whatsapp,
        'message' => $message,
        'delay' => '2'
    ],
    CURLOPT_HTTPHEADER => [
        "Authorization: $fonnte_api_key"
    ],
]);

$response = curl_exec($curl);
$http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

// Handle response
if ($http_code == 200) {
        // Response sukses
    echo json_encode([
        'alert' => 'Pendaftaran berhasil!',
        'status' => 'success'
    ]);
    exit();

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'alert' => 'Error: ' . $e->getMessage(),
        'status' => 'error'
    ]);
    exit();
}

function getPackageName($price) {
    switch ($price) {
        case '45000': return 'STARTER - Rp 45.000';
        case '95000': return 'BASIC - Rp 95.000';
        case '135000': return 'PREMIUM - Rp 135.000';
        default: return 'Paket Tidak Dikenal';
    }
}
?>
