<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

use IvoPetkov\BearFrameworkAddons\FormElements\Utilities;

$attributes = $component->getAttributes();

$text = (string) $component->text;
if (isset($attributes['text'])) {
    unset($attributes['text']);
}

$waitingText = (string) $component->waitingText;
if (isset($attributes['waitingtext'])) {
    unset($attributes['waitingtext']);
}

$waitingClass = (string) $component->waitingClass;
if (isset($attributes['waitingclass'])) {
    unset($attributes['waitingclass']);
}

$enableAfterSubmit = $component->enableAfterSubmit !== 'false';

$onClick = (string) $component->onClick;
if (strlen($onClick) === 0) {
    $onClick = 'ivoPetkov.bearFrameworkAddons.formElementsSubmitButton.onClick(this,' . json_encode($waitingText) . ',' . json_encode($waitingClass) . ',' . (int) $enableAfterSubmit . ');';
}

$attributes['data-form-element-component'] = 'button';

echo '<html><head>';
echo '<style>';
echo '[data-form-element-type="submit-button"] [data-form-element-component="button"]{cursor:pointer;user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;}';
echo Utilities::getDefaultStyles();
echo '</style>';
//$js = file_get_contents(__DIR__ . '/../dev/submit-button.js');
$js = include __DIR__ . '/submit-button.min.js.php';
echo '<script>' . $js . '</script>';
echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes('submit-button', $attributes) . '>';
echo '<span ' . Utilities::getElementAttributes($attributes) . ' onclick="' . htmlentities($onClick) . '" role="button" tabindex="0" onkeydown="if(event.keyCode===13){this.click();}">' . htmlspecialchars($text) . '</span>';
echo '</div>';
echo '</body></html>';
