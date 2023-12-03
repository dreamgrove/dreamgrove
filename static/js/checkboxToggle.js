function toggleCheckbox(checkboxId, isChecked) {
    const checkbox = document.querySelector(`input[type="checkbox"][data-id="${checkboxId}"]`);
    if (!checkbox) {
        console.error('Checkbox with data-id "' + checkboxId + '" not found.');
        return;
    }
    // Set the checkbox state if 'isChecked' is provided, otherwise toggle it.
    checkbox.checked = isChecked !== undefined ? isChecked : !checkbox.checked;
    // If this is a radio checkbox, uncheck others in the same group.
    if (checkbox.checked && checkbox.dataset.radio) {
        const radioGroupName = checkbox.dataset.radio;
        document.querySelectorAll(`input[type="checkbox"][data-radio="${radioGroupName}"]`).forEach(cb => {
            if (cb !== checkbox) {
                cb.checked = false;

            // Hide content associated with the radio checkbox
            const uncheckCheckboxId = cb.getAttribute('data-id');
            document.querySelectorAll(`[data-tag="${uncheckCheckboxId}"]`).forEach(el => {
                const listItem = el.closest('li');
                listItem.style.display = 'none';
            });
        }
    });
}

    // Find all elements with the matching data-tag and toggle their visibility.
    document.querySelectorAll(`[data-tag="${checkboxId}"]`).forEach(el => {
        const listItem = el.closest('li');
        listItem.style.display = checkbox.checked ? 'list-item' : 'none';
    });

    // Dispatch the change event if called from an event listener.
    if (isChecked === undefined) {
        checkbox.dispatchEvent(new Event('change'));
    }
}
document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners to checkboxes and set initial state
    document.querySelectorAll('input[type="checkbox"][data-id]').forEach(checkbox => {
        const checkboxId = checkbox.getAttribute('data-id');
        // Attach a change event listener
        checkbox.addEventListener('change', function () {
            toggleCheckbox(checkboxId);
        });
        // Set the initial state without dispatching the change event
        toggleCheckbox(checkboxId, checkbox.checked);
    });
});