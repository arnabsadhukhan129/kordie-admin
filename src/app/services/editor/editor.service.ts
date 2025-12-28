import { Injectable } from '@angular/core';
// src/typings.d.ts

declare global {
  interface Window {
    CKEDITOR: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  constructor() { }

  editorConfig(): any {
    return {
      allowedContent: true, // Allows all HTML elements
      extraAllowedContent: 'div p strong em', // Allows <div>, <p>, <strong>, <em> elements
      autoParagraph: false, // Prevents CKEditor from auto-wrapping content in <p>
      forcePasteAsPlainText: false, // Preserves HTML structure when pasting
      entities: false, 
      basicEntities: false,
      entities_greek: false,
      entities_latin: false,
      enterMode: window.CKEDITOR.ENTER_BR,  // Set enterMode here
      removePlugins: ['Autoformat'], // Prevent automatic 
      format_tags: 'h1;h2;h3;customParagraph',
      format_customParagraph: {
          name: 'Paragraph',
          element: 'p',
          // attributes: { 'class': 'custom-paragraph' }
      },
      stylesSet: [
        { name: 'Custom Blue Text', element: 'span', attributes: { 'style': 'color: blue; font-weight: bold;' } },
        { name: 'Highlighted Text', element: 'span', attributes: { 'style': 'background-color: yellow;' } },
        { name: 'Italic Red', element: 'span', attributes: { 'style': 'color: red; font-style: italic;' } },
        { name: 'Normal Paragraph', element: 'span'}
      ],
      // toolbar: [
      //   ['Styles', 'Format', 'Bold', 'Italic', 'Underline', 'Strike', 'TextColor', 'BGColor']
      // ]
    };
  }

  viewEditorConfig(): any {
    return {
      allowedContent: true, // Allows all HTML elements
      extraAllowedContent: 'div p strong em', // Allows <div>, <p>, <strong>, <em> elements
      autoParagraph: false, // Prevents CKEditor from auto-wrapping content in <p>
      forcePasteAsPlainText: false, // Preserves HTML structure when pasting
      entities: false, 
      basicEntities: false,
      entities_greek: false,
      entities_latin: false,
      readOnly: true // Correct property for CKEditor config
    };
  }
}
