<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

use IvoPetkov\BearFrameworkAddons\FormElements\Utilities;

$attributes = $component->getAttributes();

$attributes['data-form-element-component'] = 'html';

$value = '';
if (isset($attributes['value'])) {
    $value = $attributes['value'];
    unset($attributes['value']);
}

echo '<html><head>';
echo '<style>' . Utilities::getDefaultStyles() . '</style>';
echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes('html', $attributes) . '>';
echo Utilities::getLabelElement($attributes);
echo Utilities::getHintElement($attributes);
echo '<div ' . Utilities::getElementAttributes($attributes) . '>' . $value . '</div>';
echo Utilities::getHintAfterElement($attributes);
//$js = file_get_contents(__DIR__ . '/../dev/api.html.js');
$js = include __DIR__ . '/html.api.min.js.php';
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';
