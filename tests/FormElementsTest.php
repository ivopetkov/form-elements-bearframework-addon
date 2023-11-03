<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

/**
 * @runTestsInSeparateProcesses
 */
class FormElementsTest extends BearFramework\AddonTests\PHPUnitTestCase
{

    /**
     * 
     */
    public function testFormElements()
    {
        $app = $this->getApp();
        $html = $app->components->process('<form-element-textbox label="Test1" value="value1">');
        $this->assertTrue(strpos($html, '<input value="value1" data-form-element-component="input" type="text"') !== false);
        $this->assertTrue(strpos($html, '<span data-form-element-component="label">Test1</span>') !== false);
    }
}
