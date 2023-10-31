function toggleCheckbox(event, checkboxId) {
    event.preventDefault();
    const checkbox = document.querySelector(`[data-id="${checkboxId}"]`);
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event('change'));
}

document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-id]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const toggleText = document.getElementById(this.getAttribute('data-id'));
            if (this.checked) {
                toggleText.style.display = 'block';
            } else {
                toggleText.style.display = 'none';
            }
        });
    });
});