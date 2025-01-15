<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

use BearFramework\App;

$app = App::get();
$context = $app->contexts->get(__DIR__);

$app->localization
    ->addDictionary('en', function () use ($context) {
        return include $context->dir . '/locales/en.php';
    })
    ->addDictionary('bg', function () use ($context) {
        return include $context->dir . '/locales/bg.php';
    });

$context->classes
    ->add('IvoPetkov\BearFrameworkAddons\FormElements\*', 'classes/*.php');

$app->components
    ->addTag('form-element-checkbox', 'file:' . $context->dir . '/components/checkbox.php')
    ->addTag('form-element-html', 'file:' . $context->dir . '/components/html.php')
    ->addTag('form-element-file', 'file:' . $context->dir . '/components/file.php')
    ->addTag('form-element-hidden', 'file:' . $context->dir . '/components/hidden.php')
    ->addTag('form-element-image', 'file:' . $context->dir . '/components/image.php')
    ->addTag('form-element-password', 'file:' . $context->dir . '/components/password.php')
    ->addTag('form-element-radio', 'file:' . $context->dir . '/components/radio.php')
    ->addTag('form-element-select', 'file:' . $context->dir . '/components/select.php')
    ->addTag('form-element-submit-button', 'file:' . $context->dir . '/components/submit-button.php')
    ->addTag('form-element-button', 'file:' . $context->dir . '/components/button.php')
    ->addTag('form-element-textarea', 'file:' . $context->dir . '/components/textarea.php')
    ->addTag('form-element-textbox', 'file:' . $context->dir . '/components/textbox.php')
    ->addTag('form-element-radio-list', 'file:' . $context->dir . '/components/radio-list.php')
    ->addTag('form-element-checkbox-list', 'file:' . $context->dir . '/components/checkbox-list.php')
    ->addTag('form-element-datetime', 'file:' . $context->dir . '/components/datetime.php')
    ->addTag('form-element-rich-textarea', 'file:' . $context->dir . '/components/rich-textarea.php');
