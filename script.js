document.addEventListener("DOMContentLoaded", function () {
 // Mengambil elemen-elemen form pendaftaran
 const mainAccountSelect = document.getElementById("mainAccount");
 const extraAccountsTable = document.getElementById("extraAccounts");
 const packageSelect = document.getElementById("package");
 const totalCostDisplay = document.getElementById("totalCost");
 const form = document.getElementById("registrationForm");

 // Daftar akun Instagram yang tersedia
 const accounts = [
     "loker.engineering",
     "lokerdigitalmarketing",
     "loker_mengajar",
     "lokerjawatengah_official",
     "loker_akuntansikeuangan",
     "lokerjawatimur_official",
     "loker_dokterkesehatan"
 ];

 // Fungsi untuk memperbarui daftar akun tambahan
 function updateExtraAccounts() {
     extraAccountsTable.innerHTML = "";
     const selectedMain = mainAccountSelect.value;
     const filteredAccounts = accounts.filter(acc => acc !== selectedMain);

     filteredAccounts.forEach(account => {
         const row = document.createElement("tr");
         const checkboxCell = document.createElement("td");
         const checkbox = document.createElement("input");
         checkbox.type = "checkbox";
         checkbox.value = account;
         checkbox.classList.add("extraAccountCheckbox");
         checkboxCell.appendChild(checkbox);

         const nameCell = document.createElement("td");
         nameCell.textContent = account;

         row.appendChild(checkboxCell);
         row.appendChild(nameCell);
         extraAccountsTable.appendChild(row);
     });

     updateTotal(); // Perbarui total harga setelah daftar akun berubah
 }

 // Fungsi untuk menghitung total harga berdasarkan paket dan akun tambahan
 function updateTotal() {
     let selectedPackagePrice = parseInt(packageSelect.value);
     let additionalAccounts = document.querySelectorAll(".extraAccountCheckbox:checked").length;
     let totalCost = selectedPackagePrice + (additionalAccounts * 5000);
     totalCostDisplay.textContent = `Rp ${totalCost.toLocaleString("id-ID")}`;
 }

 // Event listener untuk form submit
 form.addEventListener("submit", function (e) {
     e.preventDefault();

     // Ambil data dari form
     const formData = new FormData(form);
     formData.append("total", totalCostDisplay.textContent);

     // Kirim data ke PHP menggunakan Fetch API
     fetch("send-message.php", {
         method: "POST",
         body: formData,
     })
     .then(response => response.json())
     .then(data => {
         // Tampilkan notifikasi dari PHP
         alert(data.alert);
     })
     .catch(error => {
         console.error("Error:", error);
         alert("Terjadi kesalahan saat mengirim data.");
     });
 });

 // Event listener untuk perubahan pada dropdown akun utama
 mainAccountSelect.addEventListener("change", updateExtraAccounts);

 // Event listener untuk perubahan paket iklan
 packageSelect.addEventListener("change", updateTotal);

 // Event listener untuk perubahan pada daftar akun tambahan
 extraAccountsTable.addEventListener("change", updateTotal);

 // Inisialisasi daftar akun tambahan pertama kali
 updateExtraAccounts();

// Mengambil elemen-elemen yang diperlukan
const carousel = document.querySelector(".carousel"); // Container carousel
const items = document.querySelectorAll(".carousel-item"); // Semua item carousel
const prevButton = document.querySelector(".carousel-button.prev"); // Tombol Previous
const nextButton = document.querySelector(".carousel-button.next"); // Tombol Next
const dotsContainer = document.querySelector(".carousel-dots"); // Container untuk dots

let currentIndex = 0; // Indeks slide saat ini
const itemsPerSlide = 4; // Jumlah item yang ditampilkan per slide
let autoSlideInterval; // Variabel untuk menyimpan interval auto-slide

// Fungsi untuk membuat dots (indikator slide)
function createDots() {
    // Loop melalui setiap item carousel dan buat dot yang sesuai
    items.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("carousel-dot");
        if (index === currentIndex) dot.classList.add("active"); // Dot aktif sesuai dengan slide saat ini
        dot.addEventListener("click", () => moveToSlide(index)); // Pindah ke slide saat dot diklik
        dotsContainer.appendChild(dot); // Tambahkan dot ke container
    });
}

// Fungsi untuk memperbarui dots aktif
function updateDots() {
    const dots = document.querySelectorAll(".carousel-dot");
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex); // Set dot aktif sesuai dengan slide saat ini
    });
}

// Fungsi untuk berpindah ke slide tertentu
function moveToSlide(index) {
    currentIndex = index; // Update indeks slide
    updateCarousel(); // Perbarui tampilan carousel
    updateDots(); // Perbarui dots
}

// Fungsi untuk memperbarui tampilan carousel
function updateCarousel() {
    const offset = -currentIndex * (100 / itemsPerSlide); // Hitung offset untuk translateX
    carousel.style.transform = `translateX(${offset}%)`; // Geser carousel sesuai offset
}

// Fungsi untuk berpindah ke slide sebelumnya
function prevSlide() {
    if (currentIndex > 0) {
        currentIndex--; // Kurangi indeks jika bukan di slide pertama
    } else {
        // Jika di slide pertama, pindah ke slide terakhir
        currentIndex = items.length - itemsPerSlide;
    }
    updateCarousel(); // Perbarui tampilan carousel
    updateDots(); // Perbarui dots
}

// Fungsi untuk berpindah ke slide berikutnya
function nextSlide() {
    if (currentIndex < items.length - itemsPerSlide) {
        currentIndex++; // Tambah indeks jika bukan di slide terakhir
    } else {
        // Jika di slide terakhir, pindah ke slide pertama
        currentIndex = 0;
    }
    updateCarousel(); // Perbarui tampilan carousel
    updateDots(); // Perbarui dots
}

// Fungsi untuk memulai auto-slide
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000); // Pindah ke slide berikutnya setiap 5 detik
}

// Fungsi untuk menghentikan auto-slide
function stopAutoSlide() {
    clearInterval(autoSlideInterval); // Hentikan interval auto-slide
}
//fungsi toggle menu
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Event listener untuk menghentikan auto-slide saat kursor berada di atas carousel
carousel.addEventListener("mouseenter", stopAutoSlide);
// Event listener untuk memulai kembali auto-slide saat kursor meninggalkan carousel
carousel.addEventListener("mouseleave", startAutoSlide);

// Event listener untuk tombol "Previous"
prevButton.addEventListener("click", prevSlide);
// Event listener untuk tombol "Next"
nextButton.addEventListener("click", nextSlide);

// Inisialisasi dots dan mulai auto-slide
createDots();
startAutoSlide();
});