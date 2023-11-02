/**
 * Toggle the state of a checkbox and associated content visibility.
 *
 * @param {Event} event - The triggering event.
 * @param {string} checkboxId - The identifier for related content to toggle.
 */
/**
 * Toggle the visibility of content associated with a checkbox.
 *
 * @param {Event} event - The event that triggered the function.
 * @param {string} checkboxId - The unique identifier for the checkbox.
 */
function toggleCheckbox(event, checkboxId) {
    event.preventDefault();

    const checkbox = document.querySelector(`input[type="checkbox"][data-id="${checkboxId}"]`);
    if (!checkbox) {
        console.error('Checkbox with data-id "' + checkboxId + '" not found.');
        return;
    }

    // Get the initial position of the checkbox.
    const initialPosition = checkbox.getBoundingClientRect().top;

    // Toggle the checkbox state.
    checkbox.checked = !checkbox.checked;

    // Find all elements with the matching data-tag and toggle their visibility.
    document.querySelectorAll(`[data-tag="${checkboxId}"]`).forEach(el => {
        el.style.display = checkbox.checked ? 'block' : 'none';
    });

    // Dispatch the change event.
    checkbox.dispatchEvent(new Event('change'));

    // Use requestAnimationFrame to wait until the browser is about to repaint.
    requestAnimationFrame(() => {
        // Calculate the difference in position after the content is toggled.
        const newPosition = checkbox.getBoundingClientRect().top;
        const positionDifference = newPosition - initialPosition;

        // If the checkbox has moved, scroll to compensate for the movement.
        if (positionDifference) {
            window.scrollBy({ top: -positionDifference, behavior: 'auto' });
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Radio-like behavior for checkboxes
    const handleRadioCheckboxChange = (checkbox) => {
        const radioGroupName = checkbox.getAttribute('data-radio');
        if (checkbox.checked && radioGroupName) {
            // Uncheck all other checkboxes in the same radio group
            document.querySelectorAll(`input[type="checkbox"][data-radio="${radioGroupName}"]`).forEach((cb) => {
                if (cb !== checkbox) {
                    cb.checked = false;
                    // Also hide the associated content for the unchecked checkbox
                    document.querySelectorAll(`[data-tag="${cb.getAttribute('data-id')}"]`).forEach(el => {
                        el.style.display = 'none';
                    });
                }
            });
        }
    };

    // Find all checkboxes and attach a change event listener to each
    document.querySelectorAll('input[type="checkbox"][data-id]').forEach(checkbox => {
        // Set the initial display state based on the checkbox's checked state
        const toggleElements = document.querySelectorAll(`[data-tag="${checkbox.getAttribute('data-id')}"]`);
        toggleElements.forEach(el => {
            el.style.display = checkbox.checked ? 'block' : 'none';
        });

        // Attach a change event listener to toggle display state and handle radio behavior
        checkbox.addEventListener('change', function () {
            // Toggle the visibility of the associated content
            toggleElements.forEach(el => {
                el.style.display = this.checked ? 'block' : 'none';
            });

            // Handle the radio-like behavior
            handleRadioCheckboxChange(this);
        });
    });

    // Adjusting inner list elements for items with the class '.cbtext-list-item'
    // If a direct child <ul> is found within these items, its children are moved up a level
    // and the unnecessary <ul> is removed.
    // this is done since when generating a listitem through a shortcode
    // its considered a block and therefor does not belong to the existing list
    document.querySelectorAll('.cbtext-list-item ul').forEach(innerUl => {
        const fragment = document.createDocumentFragment();

        // Move all children of the inner <ul> to a document fragment.
        while (innerUl.firstChild) {
            fragment.appendChild(innerUl.firstChild);
        }

        // Insert the children before the inner <ul>.
        innerUl.parentNode.insertBefore(fragment, innerUl);

        // Remove the now-empty inner <ul>.
        innerUl.remove();
    });
    // Adjust placement for items with the class '.cbtext-append-to-list'.
    const appendListItems = [...document.querySelectorAll('.cbtext-append-to-list')].reverse();
    appendListItems.forEach(appendLi => {
        // Check if there's an inner <ul> within the list item.
        const innerUl = appendLi.querySelector('ul');
        if (innerUl) {
            // Move all children of the inner <ul> to the list item.
            while (innerUl.firstChild) {
                appendLi.appendChild(innerUl.firstChild);
            }
            // Remove the now-empty inner <ul>.
            innerUl.remove();
        }

        const parentList = appendLi.closest('ul');  // find the immediate parent list
        if (parentList) {
            // Insert the list item right after the parent list.
            parentList.after(appendLi);
        }
    });
});
