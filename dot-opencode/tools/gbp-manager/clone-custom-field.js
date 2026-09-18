// == Clonar Campo Personalizado GHL (v2) ==
// 1. Abra ficha do cliente no GHL
// 2. F12 > Console > Cole
// 3. O clone aparece no final do form. Arraste pra onde quiser.

(function() {
  'use strict';

  const FIELD_NAME = 'Bairro';
  const DEBUG = true;

  function log(msg, data) {
    if (DEBUG) console.log('[CloneCF] ' + msg, data || '');
  }

  // 1. Achar container do custom field pelo label
  function findField(labelText) {
    // Tenta achar via atributo data (GHL costuma usar data-testid ou data-field)
    let el = document.querySelector('[data-field="' + labelText.toLowerCase() + '"], [data-name="' + labelText.toLowerCase() + '"]');
    if (el) return el.closest('[class*="field"], [class*="form-group"], [class*="item"], [class*="row"]') || el;

    // Procura label com texto exato (case-insensitive)
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null, false);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.tagName === 'LABEL' && node.textContent.trim().toLowerCase() === labelText.toLowerCase()) {
        // Sobe ate achar container com select/input
        let parent = node;
        for (let i = 0; i < 8; i++) {
          parent = parent.parentElement;
          if (!parent) break;
          if (parent.querySelector('select, input[type!="hidden"]') && parent !== document.body) {
            log('Container via label:', parent);
            return parent;
          }
        }
        return node.closest('[class*="el-form-item"], [class*="form-item"], [class*="field-wrapper"], [class*="custom-field"]') || node.parentElement;
      }
    }

    // Fallback: procura por texto visivel
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      if (el.children.length === 0) continue;
      const text = el.textContent.trim().toLowerCase();
      if (text === labelText.toLowerCase() && el.querySelector('select, input')) {
        return el;
      }
    }

    console.error('Campo "' + labelText + '" nao encontrado');
    return null;
  }

  // 2. Clonar e limpar
  function cloneField(source) {
    const clone = source.cloneNode(true);

    // Remove IDs unicos
    clone.querySelectorAll('[id]').forEach(el => {
      const newId = el.id + '_clone_' + Date.now();
      // Atualiza referencias no proprio clone (label for, aria-describedby, etc)
      clone.querySelectorAll('[for="' + el.id + '"], [aria-describedby="' + el.id + '"]').forEach(ref => {
        ref.setAttribute(ref.tagName === 'LABEL' ? 'for' : 'aria-describedby', newId);
      });
      el.id = newId;
    });

    // Reseta valores
    clone.querySelectorAll('select').forEach(s => { if (s.options.length) s.selectedIndex = 0; });
    clone.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio])').forEach(i => i.value = '');
    clone.querySelectorAll('input[type=checkbox], input[type=radio]').forEach(i => i.checked = false);
    clone.querySelectorAll('textarea').forEach(t => t.value = '');

    // Remove seletor de opcao selecionada em dropdowns estilizados
    clone.querySelectorAll('[class*="selected"], [class*="active"], .el-select__tags, .el-tag').forEach(el => {
      if (el.classList.contains('el-select__tags') || el.tagName === 'SPAN') el.innerHTML = '';
    });

    return clone;
  }

  // 3. Inserir no final do formulario (ou target personalizado)
  function insertClone(clone, target) {
    // Procura container de custom fields
    const containers = document.querySelectorAll(
      '[class*="custom-field"], [class*="extra-field"], ' +
      '#customFieldsContainer, [data-section="custom-fields"], ' +
      '.el-form-item:last-child, .contact-form'
    );
    
    let bestTarget = null;
    if (target && document.querySelector(target)) {
      bestTarget = document.querySelector(target);
    } else {
      // Tenta inserir depois do campo original
      bestTarget = originalField.parentElement;
      if (bestTarget) {
        bestTarget.parentNode.insertBefore(clone, bestTarget.nextSibling);
        log('Inserido apos o campo original');
        return true;
      }
      // Fallback: final do form
      const form = document.querySelector('form, [class*="contact-form"], [class*="form-container"]');
      if (form) {
        form.appendChild(clone);
        log('Inserido no final do form');
        return true;
      }
    }

    if (bestTarget) {
      bestTarget.appendChild(clone);
      return true;
    }

    console.error('Nao foi possivel encontrar local para inserir');
    return false;
  }

  // --- MAIN ---
  log('Procurando campo: ' + FIELD_NAME);
  const originalField = findField(FIELD_NAME);
  if (!originalField) {
    alert('Campo "' + FIELD_NAME + '" nao encontrado. Verifique se esta na ficha do contato.');
    return;
  }

  log('Original:', originalField);
  console.log('Container HTML:', originalField.outerHTML.substring(0, 500) + '...');

  const cloned = cloneField(originalField);
  
  // Adiciona destaque visual
  cloned.style.cssText = (cloned.style.cssText || '') + '; outline: 2px dashed #4CAF50; outline-offset: 2px; position: relative;';
  const badge = document.createElement('div');
  badge.textContent = '🔷 CLONADO';
  badge.style.cssText = 'position:absolute;top:-20px;right:0;background:#4CAF50;color:white;font-size:10px;padding:2px 6px;border-radius:4px;z-index:9999;font-family:sans-serif;';
  cloned.appendChild(badge);

  const inserted = insertClone(cloned);
  if (inserted) {
    log('Clone inserido! Scroll ate o final do form para ve-lo.');
    cloned.scrollIntoView({ behavior: 'smooth', block: 'center' });
    console.log('%c✅ Campo "' + FIELD_NAME + '" clonado com sucesso!', 'color:green;font-size:14px');
    console.log('%c⚠️ ATENCAO: O clone e visual. Salvar o contato pode nao persistir o clone. Use com cautela.', 'color:orange');
  } else {
    alert('Nao foi possivel inserir o clone. Verifique o console.');
  }
})();
