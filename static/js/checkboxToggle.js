/**
 * Toggle the state of a checkbox and dispatch a change event.
 *
 * @param {Event} event - The triggering click.
 * @param {string} checkboxId - The 'data-id' attribute of the checkbox to toggle.
 */
function toggleCheckbox(event, checkboxId) {
    event.preventDefault();
    const checkbox = document.querySelector(`[data-id="${checkboxId}"]`);
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event('change'));
}

document.addEventListener('DOMContentLoaded', function () {
    // Checkbox toggle logic
    // When a checkbox state changes, toggle the display state of the associated content.
    document.querySelectorAll('input[type="checkbox"][data-id]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const toggleText = document.getElementById(this.getAttribute('data-id'));
            toggleText.style.display = this.checked ? 'block' : 'none';
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
});
