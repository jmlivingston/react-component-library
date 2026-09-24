export default function (plop) {
  plop.setHelper('pascalCase', (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  });

  plop.setHelper('camelCase', (text) => {
    return text.charAt(0).toLowerCase() + text.slice(1);
  });

  plop.setHelper('kebabCase', (text) => {
    return text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  });

  plop.setGenerator('component', {
    description: 'Create a new component package',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (PascalCase):',
        validate: (value) => {
          if (!value) return 'Component name is required';
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
            return 'Component name must be in PascalCase (e.g., Button, Card, MyComponent)';
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../../packages/{{pascalCase name}}/package.json',
        templateFile: 'plop/package.json.hbs',
      },
      {
        type: 'add',
        path: '../../packages/{{pascalCase name}}/project.json',
        templateFile: 'plop/project.json.hbs',
      },
      {
        type: 'add',
        path: '../../packages/{{pascalCase name}}/vite.config.mjs',
        templateFile: 'plop/vite.config.mjs.hbs',
      },
      {
        type: 'add',
        path: '../../packages/{{pascalCase name}}/src/{{pascalCase name}}.jsx',
        templateFile: 'plop/Component.jsx.hbs',
      },
      {
        type: 'add',
        path: '../../packages/{{pascalCase name}}/src/{{pascalCase name}}.scss',
        templateFile: 'plop/Component.scss.hbs',
      },
      {
        type: 'add',
        path: '../../packages/{{pascalCase name}}/src/{{pascalCase name}}.test.jsx',
        templateFile: 'plop/Component.test.jsx.hbs',
      },
      {
        type: 'add',
        path: '../../packages/{{pascalCase name}}/src/{{pascalCase name}}.stories.jsx',
        templateFile: 'plop/Component.stories.jsx.hbs',
      },
      {
        type: 'add',
        path: '../../packages/{{pascalCase name}}/src/index.js',
        templateFile: 'plop/index.js.hbs',
      },
      {
        type: 'add',
        path: '../../packages/{{pascalCase name}}/.storybook/main.mjs',
        templateFile: 'plop/.storybook-main.mjs.hbs',
      },
    ],
  });
}
