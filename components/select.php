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

$options = $component->innerHTML;
if (strlen($value) > 0) {
    $search = 'value="' . $value . '"';
    $options = str_replace($search, $search . ' selected', $options);
}

$attributes['data-form-element-component'] = 'select';

echo '<html><head>';
echo '<style>' . Utilities::getDefaultStyles() . '</style>';
echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes('select', $attributes) . '>';
echo '<label>';
echo Utilities::getLabelElement($attributes);
echo Utilities::getHintElement($attributes);
echo '<select ' . Utilities::getElementAttributes($attributes) . '>' . $options . '</select>';
echo Utilities::getHintAfterElement($attributes);
echo '</label>';
//$js = file_get_contents(__DIR__ . '/../dev/api.select.js');
$js = include __DIR__ . '/select.api.min.js.php';
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';
