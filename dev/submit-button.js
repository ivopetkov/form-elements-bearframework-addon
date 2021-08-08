/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

var ivoPetkov = ivoPetkov || {};
ivoPetkov.bearFrameworkAddons = ivoPetkov.bearFrameworkAddons || {};
ivoPetkov.bearFrameworkAddons.formElementsSubmitButton = ivoPetkov.bearFrameworkAddons.formElementsSubmitButton || (function () {

    var onClick = function (button, waitingText, waitingClass, enableAfterSubmit) {
        var element = button;
        while (element && element.tagName.toLowerCase() !== 'form') {
            element = element.parentNode;
        }
        if (!element) {
            return;
        }
        if (typeof button.disableNextClick !== 'undefined' && button.disableNextClick) {
            return;
        }
        var form = element;

        var onSubmitStart = () => {
            button.disableNextClick = true;
            if (typeof button.originalInnerText === 'undefined') {
                button.originalInnerText = button.innerText;
            }
            if (typeof button.originalClass === 'undefined') {
                button.originalClass = button.getAttribute('class');
            }
            if (waitingClass.length > 0) {
                button.setAttribute('class', waitingClass);
            }
            if (waitingText.length > 0) {
                button.innerText = waitingText;
            }
            button.setAttribute('disabled', 'true');
            button.style.cursor = 'default';
        };

        var onSubmitEnd = success => {
            form.removeEventListener('submitstart', onSubmitStart);
            form.removeEventListener('submitsuccess', onSubmitSuccess);
            form.removeEventListener('submiterror', onSubmitError);
            if (!success || enableAfterSubmit) {
                button.disableNextClick = false;
                button.innerText = button.originalInnerText;
                button.removeAttribute('disabled');
                button.style.cursor = 'pointer';
                button.setAttribute('class', button.originalClass);
            }
        };

        var onSubmitSuccess = () => {
            onSubmitEnd(true);
        };

        var onSubmitError = () => {
            onSubmitEnd(false);
        };

        form.addEventListener('submitstart', onSubmitStart);
        form.addEventListener('submitsuccess', onSubmitSuccess);
        form.addEventListener('submiterror', onSubmitError);

        form.submit();
    };

    return {
        'onClick': onClick
    };

}());