import eslint from '@antfu/eslint-config';

export default eslint({
  stylistic: {
    semi: true,
  },
  rules: {
    'ts/no-require-imports': ['off'],
    'no-console': ['off'],
  },
});
