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
echo '<link rel="client-packages-embed" name="tooltip">';
echo '<style>'
    . Utilities::getDefaultStyles()
    . '[data-form-element-type="rich-textarea"] div[contenteditable]{word-break:break-word;max-width:100%;}'
    . '[data-form-element-type="rich-textarea"] div[contenteditable]:empty::before{display:block;content:attr(placeholder);opacity:0.6;pointer-events:none;}'
    . '</style>';
echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes('rich-textarea', $attributes) . '>';
echo Utilities::getLabelElement($attributes);
echo Utilities::getHintElement($attributes);
echo '<div contenteditable="true" ' . Utilities::getElementAttributes($attributes) . '>' . str_replace("\\n", "<br>", htmlentities($value)) . '</div>';
echo Utilities::getHintAfterElement($attributes);
//$js = file_get_contents(__DIR__ . '/../dev/api.rich-textarea.js');
$js = include __DIR__ . '/rich-textarea.api.min.js.php';
$js = str_replace('OPEN_URL_TEXT_TO_REPLACE', __('ivopetkov.form-element.rich-textarea.OpenURL'), $js);
$js = str_replace('EMAIL_TEXT_TO_REPLACE', __('ivopetkov.form-element.rich-textarea.Email'), $js);
$js = str_replace('CALL_TEXT_TO_REPLACE', __('ivopetkov.form-element.rich-textarea.Call'), $js);
$js = str_replace('COPY_TEXT_TO_REPLACE', __('ivopetkov.form-element.rich-textarea.Copy'), $js);
$js = str_replace('SHARE_TEXT_TO_REPLACE', __('ivopetkov.form-element.rich-textarea.Share'), $js);
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';
