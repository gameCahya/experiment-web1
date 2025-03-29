document.addEventListener('DOMContentLoaded', () => {
    // Data Akun Tambahan
    const extraAccounts = [
        { id: 'acc1', name: '@loker.engineering' },
        { id: 'acc2', name: '@lokerdigitalmarketing' },
        { id: 'acc3', name: '@loker_mengajar' },
        { id: 'acc4', name: '@lokerjawatengah_official' },
        { id: 'acc5', name: '@loker_akuntansikeuangan' },
        { id: 'acc6', name: '@lokerjawatimur_official' },
        { id: 'acc7', name: '@loker_dokterkesehatan' }
    ];

    // Render Akun Tambahan
    const tbody = document.getElementById('extraAccounts');
    extraAccounts.forEach(acc => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="border p-2">
                <input type="checkbox" name="extraAccounts[]" value="${acc.id}" 
                    class="extra-account" data-price="5000">
            </td>
            <td class="border p-2">${acc.name}</td>
        `;
        tbody.appendChild(row);
    });

    // Hitung Total
    function calculateTotal() {
        const packagePrice = parseInt(document.getElementById('package').value);
        const extraAccounts = document.querySelectorAll('.extra-account:checked');
        const extraCost = extraAccounts.length * 5000;
        return packagePrice + extraCost;
    }

    // Update Tampilan Total
    function updateTotal() {
        const total = calculateTotal();
        document.getElementById('totalCost').textContent = `Rp ${total.toLocaleString()}`;
        document.getElementById('submitBtn').disabled = total < 45000;
    }

    // Event Listeners
    document.getElementById('package').addEventListener('change', updateTotal);
    document.querySelectorAll('.extra-account').forEach(checkbox => {
        checkbox.addEventListener('change', updateTotal);
    });

    // Validasi Form
    document.getElementById('registrationForm').addEventListener('submit', (e) => {
        let isValid = true;

        // Validasi Nama
        const nameInput = document.getElementById('name');
        if (nameInput.value.length < 3) {
            document.getElementById('nameError').classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById('nameError').classList.add('hidden');
        }

        // Validasi Email
        const emailInput = document.getElementById('email');
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailInput.value)) {
            document.getElementById('emailError').classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById('emailError').classList.add('hidden');
        }

        // Validasi WhatsApp
        const whatsappInput = document.getElementById('whatsapp');
        if (!/^08[0-9]{9,12}$/.test(whatsappInput.value)) {
            document.getElementById('whatsappError').classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById('whatsappError').classList.add('hidden');
        }

        if (!isValid) {
            e.preventDefault();
            alert('Silakan periksa kembali data yang Anda masukkan!');
        }
    });

    // Inisialisasi Total
    updateTotal();
});
