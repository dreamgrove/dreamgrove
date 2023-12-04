function toggleCheckbox(checkboxId) {
    const checkbox = document.querySelector(`input[type="checkbox"][data-id="${checkboxId}"]`);
    if (!checkbox) {
        console.error('Checkbox with data-id "' + checkboxId + '" not found.');
        return;
    }

    // Handle radio group logic
    if (checkbox.hasAttribute('data-radio')) {
        const radioGroup = checkbox.getAttribute('data-radio');
        document.querySelectorAll(`input[type="checkbox"][data-radio="${radioGroup}"]`).forEach(radio => {
            if (radio.getAttribute('data-id') !== checkboxId) {
                radio.checked = false;
                updateVisibility(radio.getAttribute('data-id'));
            }
        });
    }

    // Handle dependency logic
    if (checkbox.hasAttribute('data-dependent-on')) {
        const dependentId = checkbox.getAttribute('data-dependent-on');
        const dependentCheckbox = document.querySelector(`input[type="checkbox"][data-id="${dependentId}"]`);
        if (dependentCheckbox && checkbox.checked && !dependentCheckbox.checked) {
            dependentCheckbox.checked = true;
            updateVisibility(dependentId);
        }
    }

    // Handle dependent checkboxes
    document.querySelectorAll(`input[type="checkbox"][data-dependent-on="${checkboxId}"]`).forEach(dependent => {
        if (!checkbox.checked && dependent.checked) {
            dependent.checked = false;
            updateVisibility(dependent.getAttribute('data-id'));
        }
    });

    // Update visibility for the current checkbox
    updateVisibility(checkboxId);
}

function updateVisibility(checkboxId) {
    // Find all elements with the matching data-tag and toggle their visibility based on the negate attribute.
    document.querySelectorAll(`[data-tag="${checkboxId}"]`).forEach(el => {
        const listItem = el.closest('li');
        const isNegated = el.getAttribute('data-negate') === 'true';
        // Adjust visibility based on negate attribute
        const checkbox = document.querySelector(`input[type="checkbox"][data-id="${checkboxId}"]`);
        listItem.style.display = (checkbox.checked !== isNegated) ? 'list-item' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="checkbox"][data-id]').forEach(checkbox => {
        const checkboxId = checkbox.getAttribute('data-id');
        updateVisibility(checkboxId); // Set initial state
        checkbox.addEventListener('change', () => toggleCheckbox(checkboxId));
    });
});
