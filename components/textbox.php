<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

use IvoPetkov\BearFrameworkAddons\FormElements\Utilities;

$attributes = $component->getAttributes();

$inputType = (string)$component->getAttribute('inputType');
if ($inputType !== null) {
    unset($attributes['inputtype']);
}

$attributes['data-form-element-component'] = 'input';
$attributes['type'] = $inputType === '' ? 'text' : $inputType;

echo '<html><head>';
echo '<style>' . Utilities::getDefaultStyles() . '</style>';
echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes('textbox', $attributes) . '>';
echo '<label>';
echo Utilities::getLabelElement($attributes);
echo Utilities::getHintElement($attributes);
echo '<input ' . Utilities::getElementAttributes($attributes) . '/>';
echo Utilities::getHintAfterElement($attributes);
echo '</label>';
//$js = file_get_contents(__DIR__ . '/../dev/api.textbox.js');
$js = include __DIR__ . '/textbox.api.min.js.php';
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';