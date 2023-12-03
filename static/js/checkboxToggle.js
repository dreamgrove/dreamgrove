function toggleCheckbox(checkboxId) {
    const checkbox = document.querySelector(`input[type="checkbox"][data-id="${checkboxId}"]`);
    if (!checkbox) {
        console.error('Checkbox with data-id "' + checkboxId + '" not found.');
        return;
    }

    // Find all elements with the matching data-tag and toggle their visibility based on the negate attribute.
    document.querySelectorAll(`[data-tag="${checkboxId}"]`).forEach(el => {
        const listItem = el.closest('li');
        const isNegated = el.getAttribute('data-negate') === 'true';
        // Adjust visibility based on negate attribute
        listItem.style.display = (checkbox.checked !== isNegated) ? 'list-item' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="checkbox"][data-id]').forEach(checkbox => {
        const checkboxId = checkbox.getAttribute('data-id');
        toggleCheckbox(checkboxId); // Set initial state
        checkbox.addEventListener('change', () => toggleCheckbox(checkboxId));
    });
});
