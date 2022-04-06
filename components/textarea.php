<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

use IvoPetkov\BearFrameworkAddons\FormElements\Utilities;

$attributes = $component->getAttributes();

$value = (string) $component->value;
if (isset($attributes['value'])) {
    unset($attributes['value']);
}

$attributes['data-form-element-component'] = 'textarea';

echo '<html><head>';
echo '<style>[data-form-element-type="textarea"] textarea{resize:none;}' . Utilities::getDefaultStyles() . '</style>';
echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes('textarea', $attributes) . '>';
echo '<label>';
echo Utilities::getLabelElement($attributes);
echo Utilities::getHintElement($attributes);
echo '<textarea  ' . Utilities::getElementAttributes($attributes) . '>' . htmlentities($value) . '</textarea>';
echo '</label>';
//$js = file_get_contents(__DIR__ . '/../dev/api.textarea.js');
$js = include __DIR__ . '/textarea.api.min.js.php';
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';
