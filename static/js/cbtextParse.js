document.addEventListener('DOMContentLoaded', function() {
    // Replace placeholders with actual content.
    document.querySelectorAll('.cbtext-placeholder').forEach(function(el) {
        var id = el.getAttribute('data-tag');
        var content = el.getAttribute('data-content');
        var negate = el.getAttribute('negate') === 'true' ? 'data-negate="true"' : '';
        var replacementHtml = '';

        if (el.parentNode.tagName === 'LI' && el.parentNode.childNodes.length === 1) {
            replacementHtml = `'<ul ${negate} data-tag="` + id + '">' + content + '</ul>';
        } else if (el.parentNode.tagName === 'LI') {
            replacementHtml = `<span ${negate} data-tag="` + id + '">' + content + '</span>';
        } else {
            replacementHtml = `<span ${negate} data-tag="` + id + '">' + content + '</span>';
        }

        el.outerHTML = replacementHtml;
    });

    // Set the initial state of each checkbox and its associated content.
    document.querySelectorAll('input[type="checkbox"][data-id]').forEach(checkbox => {
        const checkboxId = checkbox.getAttribute('data-id');
        checkbox.addEventListener('change', () => toggleCheckbox(checkboxId));
        toggleCheckbox(checkboxId, checkbox.checked);
    });
});
