const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, 
        UnderlineType, LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

// Настройка границ для таблиц
const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: { 
      document: { 
        run: { font: "Arial", size: 22 }
      } 
    },
    paragraphStyles: [
      { 
        id: "Title", 
        name: "Title", 
        basedOn: "Normal",
        run: { size: 64, bold: true, color: "163F6F", font: "Arial" },
        paragraph: { spacing: { before: 480, after: 240 }, alignment: AlignmentType.CENTER }
      },
      { 
        id: "Heading1", 
        name: "Heading 1", 
        basedOn: "Normal", 
        next: "Normal",
        run: { size: 36, bold: true, color: "163F6F", font: "Arial" },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 }
      },
      { 
        id: "Heading2", 
        name: "Heading 2", 
        basedOn: "Normal", 
        next: "Normal",
        run: { size: 30, bold: true, color: "163F6F", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
      },
      { 
        id: "Heading3", 
        name: "Heading 3", 
        basedOn: "Normal", 
        next: "Normal",
        run: { size: 26, bold: true, color: "163F6F", font: "Arial" },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 2 }
      }
    ]
  },
  numbering: {
    config: [
      { 
        reference: "bullet-list",
        levels: [
          { 
            level: 0, 
            format: LevelFormat.BULLET, 
            text: "•", 
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }
        ]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // ТИТУЛЬНАЯ СТРАНИЦА
      new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [new TextRun("ТЕХНИЧЕСКОЕ ЗАДАНИЕ")]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 240 },
        children: [new TextRun({
          text: "на разработку интерактивного урока",
          size: 28,
          color: "7F8C8D"
        })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [new TextRun({
          text: "Урок 2: \"Искусство обратной связи\"",
          size: 36,
          bold: true,
          color: "FF9800"
        })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [new TextRun({
          text: "🎮 GAMIFIED & INTERACTIVE EDITION",
          size: 24,
          bold: true,
          color: "7B68EE"
        })]
      }),
      
      // Общая информация
      new Table({
        columnWidths: [3000, 6360],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 3000, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Проект:", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6360, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Team Lead Academy")]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 3000, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Урок:", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6360, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Урок 2 из 12")]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 3000, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Интерактивных элементов:", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6360, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("15+ (модалки, drag-drop, анимации, таймеры)")]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 3000, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Уровень геймификации:", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6360, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Высокий (анимации, звуки, конфетти, награды)")]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 3000, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Дата создания:", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6360, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("10 ноября 2025")]
                })]
              })
            ]
          })
        ]
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // ИНТЕРАКТИВНЫЕ ФИЧИ
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("🎮 Интерактивные элементы (ТОП-5)")]
      }),
      
      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [new TextRun({
          text: "Курс должен демонстрировать максимум интерактивных возможностей и геймификации. Ниже описаны ключевые интерактивные фичи, которые ОБЯЗАТЕЛЬНО должны быть реализованы.",
          size: 22
        })]
      }),
      
      new Table({
        columnWidths: [1500, 4000, 3860],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                shading: { fill: "7B68EE", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "№", bold: true, color: "FFFFFF" })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 4000, type: WidthType.DXA },
                shading: { fill: "7B68EE", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Интерактивная фича", bold: true, color: "FFFFFF" })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 3860, type: WidthType.DXA },
                shading: { fill: "7B68EE", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Экран", bold: true, color: "FFFFFF" })]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                shading: { fill: "F0F8FF", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "1", bold: true, size: 24 })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 4000, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun({
                    text: "Модальные окна с деталями модели SBI",
                    bold: true
                  })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 3860, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Экран 3-4")]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                shading: { fill: "F0F8FF", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "2", bold: true, size: 24 })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 4000, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun({
                    text: "Drag & Drop: Собери пример SBI",
                    bold: true
                  })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 3860, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Экран 4")]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                shading: { fill: "F0F8FF", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "3", bold: true, size: 24 })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 4000, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun({
                    text: "Hover-preview + таймер \"Подумай 5 сек\"",
                    bold: true
                  })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 3860, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Экран 7")]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                shading: { fill: "F0F8FF", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "4", bold: true, size: 24 })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 4000, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun({
                    text: "Аккордеон \"Сравни варианты\"",
                    bold: true
                  })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 3860, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Экран 8")]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                shading: { fill: "F0F8FF", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "5", bold: true, size: 24 })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 4000, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun({
                    text: "Анимация наград: конфетти + звуки",
                    bold: true
                  })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 3860, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Экран 13")]
                })]
              })
            ]
          })
        ]
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // ФИЧА 1: МОДАЛЬНЫЕ ОКНА
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("💡 Фича 1: Модальные окна SBI")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Экраны: 3-4")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Описание")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("На экранах с моделью SBI каждый блок (S, B, I) становится кликабельным. При клике открывается модальное окно с подробной информацией, примерами и советами.")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Технические требования")]
      }),
      
      new Table({
        columnWidths: [2500, 6860],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Триггер", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Клик на блок S, B или I")]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Анимация открытия", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Оверлей затемнение с backdrop-blur (0.3s ease-out)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Модалка появляется с scale(0.8 → 1) + fadeIn")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Общая длительность: 0.4s")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Размер модалки", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Desktop: 600px ширина, max-height: 80vh")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Mobile: 90vw ширина, max-height: 90vh")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Содержимое модалки", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Заголовок с иконкой (S/B/I) и названием")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Определение (2-3 предложения)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("2-3 примера в цветных карточках")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Раздел 'Типичные ошибки' (2 пункта)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Кнопка 'Понятно' (закрывает модалку)")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Закрытие", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Кнопка ✕ в правом верхнем углу")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Клик на оверлей (вне модалки)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Клавиша ESC")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Кнопка 'Понятно'")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Прогресс изучения", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("После открытия модалки блок помечается как 'изучен' (галочка ✓)")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("Под схемой показывается: 'Изучено: 2/3'")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("Кнопка 'Далее' активируется только после изучения всех 3 блоков")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Цветовая схема", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("S (Ситуация): синий фон #E3F2FD, заголовок #7B68EE")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("B (Поведение): зеленый фон #E8F5E9, заголовок #4CAF50")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("I (Влияние): оранжевый фон #FFF3E0, заголовок #FF9800")]
                  })
                ]
              })
            ]
          })
        ]
      }),
      
      new Paragraph({
        spacing: { before: 240 },
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Содержимое каждой модалки")]
      }),
      
      // Модалка S
      new Paragraph({
        spacing: { before: 120 },
        children: [new TextRun({
          text: "МОДАЛКА 'S - SITUATION'",
          bold: true,
          size: 24,
          color: "7B68EE"
        })]
      }),
      
      new Table({
        columnWidths: [9360],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 9360, type: WidthType.DXA },
                shading: { fill: "E3F2FD", type: ShadingType.CLEAR },
                children: [
                  new Paragraph({ 
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ 
                      text: "S - SITUATION (Ситуация)",
                      size: 28,
                      bold: true,
                      color: "7B68EE"
                    })]
                  }),
                  new Paragraph({ spacing: { before: 180 }}),
                  new Paragraph({ 
                    children: [new TextRun({
                      text: "Определение:",
                      bold: true
                    })]
                  }),
                  new Paragraph({ 
                    children: [new TextRun("Контекст, в котором произошло событие. Когда и где это случилось?")]
                  }),
                  new Paragraph({ spacing: { before: 120 }}),
                  new Paragraph({ 
                    children: [new TextRun({
                      text: "Примеры:",
                      bold: true
                    })]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("\"Вчера на daily meeting в 10:00...\"")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("\"В прошлом спринте в твоей задаче...\"")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("\"На презентации для клиента в четверг...\"")]
                  }),
                  new Paragraph({ spacing: { before: 120 }}),
                  new Paragraph({ 
                    children: [new TextRun({
                      text: "Типичные ошибки:",
                      bold: true,
                      color: "F44336"
                    })]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("❌ \"Ты всегда...\" (слишком обобщенно)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("❌ \"Вообще...\" (нет конкретного момента)")]
                  })
                ]
              })
            ]
          })
        ]
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // ФИЧА 2: DRAG & DROP
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("🎯 Фича 2: Drag & Drop - Собери пример")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Экран: 4")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Описание")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("После теории студент должен собрать правильный пример обратной связи, расставив элементы S-B-I в правильном порядке. Это активное обучение через действие.")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Визуальное оформление")]
      }),
      
      new Table({
        columnWidths: [9360],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 9360, type: WidthType.DXA },
                shading: { fill: "FFF9E6", type: ShadingType.CLEAR },
                children: [
                  new Paragraph({ 
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ 
                      text: "🎮 ИНТЕРАКТИВНОЕ ЗАДАНИЕ",
                      size: 26,
                      bold: true,
                      color: "FF9800"
                    })]
                  }),
                  new Paragraph({ spacing: { before: 120 }}),
                  new Paragraph({ 
                    children: [new TextRun({
                      text: "Задание: Собери правильный пример обратной связи",
                      bold: true,
                      size: 22
                    })]
                  }),
                  new Paragraph({ spacing: { before: 120 }}),
                  new Paragraph({ 
                    children: [new TextRun("Перетащи карточки в правильном порядке (S → B → I), чтобы получить корректную обратную связь.")]
                  })
                ]
              })
            ]
          })
        ]
      }),
      
      new Paragraph({
        spacing: { before: 180 },
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Технические требования")]
      }),
      
      new Table({
        columnWidths: [2500, 6860],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Библиотека", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Использовать: SortableJS или React DnD (на выбор разработчика)")]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Начальное состояние", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("3 карточки в случайном порядке в области 'Перетащи сюда'")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("Пример контента карточек:")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("B: 'ты опоздал на 15 минут и не предупредил'")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("I: 'команда ждала, и мы потеряли время'")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("S: 'Вчера на daily meeting в 10:00'")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Область дропа", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("3 слота с подписями:")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Слот 1: 'S - Ситуация' (синяя рамка #7B68EE)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Слот 2: 'B - Поведение' (зеленая рамка #4CAF50)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Слот 3: 'I - Влияние' (оранжевая рамка #FF9800)")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Визуальные состояния", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Захват карточки: scale(1.05), box-shadow увеличивается, cursor: grabbing")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Hover над слотом: пунктирная анимация границы, легкое свечение")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Drop в слот: плавная анимация размещения (0.3s ease-out)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Неправильный слот: красное мигание, возврат обратно")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Проверка", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("Кнопка 'Проверить' активируется после заполнения всех 3 слотов")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("При клике:")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun({
                      text: "Правильно:",
                      bold: true,
                      color: "4CAF50"
                    }), new TextRun(" карточки подсвечиваются зеленым, анимация успеха, +20 XP")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun({
                      text: "Неправильно:",
                      bold: true,
                      color: "F44336"
                    }), new TextRun(" неправильные карточки трясутся, подсказка 'Попробуй еще раз'")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Попытки", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("Неограниченное количество попыток")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("После 2 неудачных попыток → кнопка 'Показать подсказку'")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("Подсказка: подсвечивается правильный слот для следующей карточки")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Mobile адаптация", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("На мобильных: вместо drag-drop использовать tap-to-select")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("Логика: клик на карточку → выделяется → клик на слот → размещается")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("Touch-friendly размер карточек: min 44x44px")]
                  })
                ]
              })
            ]
          })
        ]
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // ФИЧА 3: HOVER + ТАЙМЕР
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("⏱️ Фича 3: Hover-preview + Таймер")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Экран: 7 (Выбор решения)")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Описание")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Перед принятием решения показываем preview последствий при наведении. После клика - модалка с таймером, которая учит не торопиться с важными решениями.")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Часть 1: Hover-preview")]
      }),
      
      new Table({
        columnWidths: [2500, 6860],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Триггер", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Наведение курсора на карточку с вариантом")]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Анимация", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Карточка расширяется вниз (height: auto, 0.3s ease-out)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Появляется панель с краткой информацией")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Box-shadow усиливается")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Содержимое preview", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Иконка последствия: 😟 / 😊 / 😐")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("XP: отображается но без точного числа ('Низкий XP' / 'Высокий XP' / 'Нет XP')")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Индикатор уровня: цветная полоска (красная/зеленая/желтая)")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Цель", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Дать студенту подсказку о серьезности выбора, но не спойлерить детали")]
                })]
              })
            ]
          })
        ]
      }),
      
      new Paragraph({
        spacing: { before: 240 },
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Часть 2: Модалка 'Подумай 5 секунд'")]
      }),
      
      new Table({
        columnWidths: [2500, 6860],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Триггер", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Клик на кнопку 'Выбрать этот вариант'")]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Появление модалки", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("Затемненный оверлей + модальное окно в центре")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("Размер: 400x300px (desktop), 90vw (mobile)")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Содержимое", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun({
                      text: "Заголовок: '⏱️ Подумай еще раз'",
                      bold: true,
                      size: 24
                    })]
                  }),
                  new Paragraph({ spacing: { before: 120 }}),
                  new Paragraph({ 
                    children: [new TextRun("Текст: 'Ты уверен в своем выборе? Важные решения не нужно принимать спонтанно. Давай обдумаем еще раз.'")]
                  }),
                  new Paragraph({ spacing: { before: 120 }}),
                  new Paragraph({ 
                    children: [new TextRun({
                      text: "Таймер: большая цифра в центре (5 → 4 → 3 → 2 → 1)",
                      bold: true
                    })]
                  }),
                  new Paragraph({ 
                    children: [new TextRun("Размер таймера: 72px, цвет меняется от синего к оранжевому")]
                  }),
                  new Paragraph({ spacing: { before: 120 }}),
                  new Paragraph({ 
                    children: [new TextRun("Круговой прогресс-бар вокруг цифры (визуальное countdown)")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Кнопки", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun({
                      text: "Кнопка 'Изменить выбор':",
                      bold: true
                    }), new TextRun(" серая, доступна всегда")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun({
                      text: "Кнопка 'Подтвердить':",
                      bold: true
                    }), new TextRun(" неактивна первые 5 секунд (disabled state), затем активируется")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Поведение таймера", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("Отсчет: 5 секунд с интервалом 1 секунда")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("Анимация: плавная пульсация при смене цифры")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("Звук: тихий 'тик' на каждой секунде (опционально, можно отключить)")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("После 0: кнопка 'Подтвердить' подсвечивается и немного увеличивается (привлекает внимание)")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Закрытие модалки", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Клик 'Изменить выбор' → закрытие, возврат к карточкам")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Клик 'Подтвердить' (после 5 сек) → переход к результату")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("ESC / клик вне модалки → ЗАПРЕЩЕН (заставляем сделать выбор)")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Обучающая цель", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Научить студента не принимать импульсивные решения. В реальности обратная связь требует обдумывания.")]
                })]
              })
            ]
          })
        ]
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // ФИЧА 4: АККОРДЕОН
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("📊 Фича 4: Аккордеон 'Сравни варианты'")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Экран: 8 (Фидбек на выбор)")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Описание")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("После получения фидбека студент может раскрыть аккордеон и посмотреть, что было бы при других вариантах выбора. Это углубляет понимание последствий.")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Технические требования")]
      }),
      
      new Table({
        columnWidths: [2500, 6860],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Расположение", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Под основным фидбеком и наградами, перед кнопкой 'Продолжить'")]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Заголовок", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun({
                      text: "'🔍 Интересно, что было бы при других вариантах?'",
                      bold: true,
                      size: 22
                    })]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("Кнопка-переключатель с иконкой ▼ / ▲")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Анимация раскрытия", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Плавное раскрытие: max-height: 0 → auto, 0.4s ease-out")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Иконка стрелки поворачивается на 180°")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Содержимое появляется с fadeIn")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Содержимое", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("2 карточки с альтернативными вариантами (те, что НЕ были выбраны)")]
                  }),
                  new Paragraph({ spacing: { before: 80 }}),
                  new Paragraph({ 
                    children: [new TextRun("Каждая карточка содержит:")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Название варианта (например, 'Вариант А')")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Краткое описание действия")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Последствия (2-3 пункта)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Награды/потери (XP, навыки, риски)")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Цветовое кодирование", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Плохой вариант: светло-красный фон #FFE5E5")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Нейтральный вариант: светло-желтый фон #FFF9E6")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Лучший вариант: светло-зеленый фон #E8F5E9 (если не был выбран)")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Дополнительная фича", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("Если выбран НЕПРАВИЛЬНЫЙ вариант:")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("→ правильный вариант подсвечивается и помечается как '✅ Это был лучший выбор'")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    children: [new TextRun("→ показывается разница в наградах (+40 XP vs +5 XP)")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Обучающая цель", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Показать студенту альтернативные сценарии. Учить на контрасте - почему один вариант лучше другого.")]
                })]
              })
            ]
          })
        ]
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // ФИЧА 5: АНИМАЦИЯ НАГРАД
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("🎉 Фича 5: Анимация наград")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Экран: 13 (Итоги урока)")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Описание")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Впечатляющая анимация наград с конфетти, звуками и визуальными эффектами. Создает ощущение достижения и мотивирует продолжать обучение.")]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Последовательность анимаций")]
      }),
      
      new Table({
        columnWidths: [1500, 2500, 5360],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                shading: { fill: "FF9800", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Шаг", bold: true, color: "FFFFFF" })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "FF9800", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Элемент", bold: true, color: "FFFFFF" })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 5360, type: WidthType.DXA },
                shading: { fill: "FF9800", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Анимация", bold: true, color: "FFFFFF" })]
                })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "0.0s", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Конфетти")]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 5360, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("Взрыв конфетти из центра экрана")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 60 },
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Цвета: #7B68EE, #4CAF50, #FF9800, #F44336")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Количество: 150-200 частиц")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Физика: падение с гравитацией и вращением")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Библиотека: canvas-confetti.js")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "0.2s", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Заголовок")]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 5360, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("'🎉 УРОК 2 ПРОЙДЕН!' появляется с эффектом:")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 60 },
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Scale: 0.5 → 1.1 → 1.0 (bounce)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Opacity: 0 → 1")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Длительность: 0.6s")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "0.4s", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Звук успеха")]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 5360, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("Проигрывается звук 'level-up' или 'achievement'")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 60 },
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Формат: MP3, OGG (fallback)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Длительность: 1-2 секунды")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Возможность отключить в настройках")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "0.6s", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Список наград")]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 5360, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("Каждый пункт появляется по очереди (stagger):")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 60 },
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Задержка между пунктами: 0.15s")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Эффект: slideInLeft + fadeIn")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Иконка галочки ✅ пульсирует при появлении")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "1.2s", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("XP счетчик")]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 5360, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("Анимированный счет от текущего до нового значения:")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 60 },
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Например: 50 XP → 150 XP")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Счет цифр: easing function (ease-out)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Длительность: 1.5s")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Цифры увеличиваются с легким bounce")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "1.4s", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Прогресс-бары навыков")]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 5360, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("Каждый прогресс-бар заполняется анимированно:")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 60 },
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Задержка между барами: 0.2s (stagger)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Заполнение: слева направо, 0.8s ease-out")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Эффект shine двигается вдоль бара")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Цифра навыка (3→5) меняется с flip-анимацией")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "2.0s", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Значки достижений")]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 5360, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("Каждый значок появляется с эффектом:")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 60 },
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Вылет снизу с rotation и scale")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Приземление с bounce эффектом")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Пульсирующее свечение вокруг значка (3 раза)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Отдельный короткий звук 'ding' для каждого")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 1500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "3.0s", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Финальный эффект")]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 5360, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("Второй взрыв конфетти (меньше, по краям экрана)")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 60 },
                    children: [new TextRun("Кнопки появляются с fadeIn + slideUp")]
                  })
                ]
              })
            ]
          })
        ]
      }),
      
      new Paragraph({
        spacing: { before: 240 },
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Дополнительные требования")]
      }),
      
      new Table({
        columnWidths: [2500, 6860],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Performance", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Использовать CSS animations где возможно (лучше производительность)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Для конфетти использовать canvas (60 FPS)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("На слабых устройствах уменьшить количество частиц")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Настройки", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    children: [new TextRun("Добавить toggle в настройках курса:")]
                  }),
                  new Paragraph({ 
                    spacing: { before: 80 },
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("'Звуковые эффекты' (вкл/выкл)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("'Анимации' (полные/упрощенные/выкл)")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Сохранять выбор в localStorage")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Accessibility", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Учитывать prefers-reduced-motion")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Если включен, показывать упрощенную версию без конфетти")]
                  }),
                  new Paragraph({ 
                    numbering: { reference: "bullet-list", level: 0 },
                    children: [new TextRun("Screen reader: озвучивать награды последовательно")]
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2500, type: WidthType.DXA },
                shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                children: [new Paragraph({ 
                  children: [new TextRun({ text: "Мотивационная цель", bold: true })]
                })]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 6860, type: WidthType.DXA },
                children: [new Paragraph({ 
                  children: [new TextRun("Создать wow-эффект. Студент должен почувствовать: 'Я молодец, я это заслужил!'. Положительные эмоции = мотивация продолжать.")]
                })]
              })
            ]
          })
        ]
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // ЗАКЛЮЧИТЕЛЬНАЯ СЕКЦИЯ
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("✅ Критерии приемки интерактивных элементов")]
      }),
      
      new Paragraph({
        spacing: { before: 120 },
        children: [new TextRun({
          text: "Все ТОП-5 интерактивных элементов должны быть реализованы и работать корректно:",
          size: 22
        })]
      }),
      
      new Paragraph({ spacing: { before: 180 }}),
      
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({
          text: "Фича 1: Модальные окна SBI",
          bold: true
        })]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Клик на каждый блок S/B/I открывает модалку")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Прогресс '2/3' отображается корректно")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Кнопка 'Далее' блокируется до изучения всех блоков")]
      }),
      
      new Paragraph({ spacing: { before: 120 }}),
      
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({
          text: "Фича 2: Drag & Drop",
          bold: true
        })]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Карточки перетаскиваются плавно")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Правильность проверяется корректно")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Подсказка появляется после 2 неудачных попыток")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Mobile версия (tap-to-select) работает")]
      }),
      
      new Paragraph({ spacing: { before: 120 }}),
      
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({
          text: "Фича 3: Hover + Таймер",
          bold: true
        })]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Hover показывает preview последствий")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Модалка с таймером 5 секунд работает")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Кнопка 'Подтвердить' блокируется на 5 секунд")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("ESC не закрывает модалку (принудительный выбор)")]
      }),
      
      new Paragraph({ spacing: { before: 120 }}),
      
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({
          text: "Фича 4: Аккордеон 'Сравни варианты'",
          bold: true
        })]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Аккордеон раскрывается/сворачивается плавно")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Показываются 2 альтернативных варианта")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Правильный вариант помечен, если не был выбран")]
      }),
      
      new Paragraph({ spacing: { before: 120 }}),
      
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({
          text: "Фича 5: Анимация наград",
          bold: true
        })]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Конфетти падает с физикой")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Звуковые эффекты проигрываются")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("XP счетчик анимированно увеличивается")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Прогресс-бары заполняются последовательно")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Значки достижений вылетают с bounce")]
      }),
      new Paragraph({
        indent: { left: 720 },
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Вся последовательность занимает ~3 секунды")]
      }),
      
      new Paragraph({ spacing: { before: 240 }}),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Общие требования")]
      }),
      
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("60 FPS на современных устройствах")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Graceful degradation на слабых устройствах")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Поддержка prefers-reduced-motion")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Возможность отключить звуки и анимации")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Все интерактивы работают на mobile")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Нет критических багов в консоли")]
      }),
      
      new Paragraph({ spacing: { before: 360 }}),
      
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240 },
        children: [new TextRun({
          text: "🎮 Курс готов к геймификации!",
          size: 28,
          bold: true,
          color: "7B68EE"
        })]
      }),
      
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120 },
        children: [new TextRun({
          text: "Конец технического задания",
          size: 20,
          italics: true,
          color: "7F8C8D"
        })]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  require('fs').writeFileSync('/mnt/user-data/outputs/TZ_Lesson2_Interactive_FINAL.docx', buffer);
  console.log('✅ Интерактивное ТЗ создано: TZ_Lesson2_Interactive_FINAL.docx');
});
