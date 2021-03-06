import { Program } from 'typescript';
import { TSESTree, TSNode, TSESTreeToTSNode, TSToken } from './ts-estree';

type DebugModule = 'typescript-eslint' | 'eslint' | 'typescript';

export interface Extra {
  code: string;
  comment: boolean;
  comments: TSESTree.Comment[];
  createDefaultProgram: boolean;
  debugLevel: Set<DebugModule>;
  errorOnTypeScriptSyntacticAndSemanticIssues: boolean;
  errorOnUnknownASTType: boolean;
  extraFileExtensions: string[];
  filePath: string;
  jsx: boolean;
  loc: boolean;
  log: Function;
  preserveNodeMaps?: boolean;
  projects: string[];
  range: boolean;
  strict: boolean;
  tokens: null | TSESTree.Token[];
  tsconfigRootDir: string;
  useJSXTextNode: boolean;
}

////////////////////////////////////////////////////
// MAKE SURE THIS IS KEPT IN SYNC WITH THE README //
////////////////////////////////////////////////////

export interface TSESTreeOptions {
  /**
   * create a top-level comments array containing all comments
   */
  comment?: boolean;

  /**
   * For convenience:
   * - true === ['typescript-eslint']
   * - false === []
   *
   * An array of modules to turn explicit debugging on for.
   * - 'typescript-eslint' is the same as setting the env var `DEBUG=typescript-eslint:*`
   * - 'eslint' is the same as setting the env var `DEBUG=eslint:*`
   * - 'typescript' is the same as setting `extendedDiagnostics: true` in your tsconfig compilerOptions
   */
  debugLevel?: boolean | DebugModule[];

  /**
   * Causes the parser to error if the TypeScript compiler returns any unexpected syntax/semantic errors.
   */
  errorOnTypeScriptSyntacticAndSemanticIssues?: boolean;

  /**
   * Cause the parser to error if it encounters an unknown AST node type (useful for testing).
   * This case only usually occurs when TypeScript releases new features.
   */
  errorOnUnknownASTType?: boolean;

  /**
   * When `project` is provided, this controls the non-standard file extensions which will be parsed.
   * It accepts an array of file extensions, each preceded by a `.`.
   */
  extraFileExtensions?: string[];

  /**
   * The absolute path to the file being parsed.
   * When `project` is provided, this is required, as it is used to fetch the file from the TypeScript compiler's cache.
   */
  filePath?: string;

  /**
   * Enable parsing of JSX.
   * For more details, see https://www.typescriptlang.org/docs/handbook/jsx.html
   *
   * NOTE: this setting does not effect known file types (.js, .jsx, .ts, .tsx, .json) because the
   * TypeScript compiler has its own internal handling for known file extensions.
   *
   * For the exact behavior, see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#parseroptionsecmafeaturesjsx
   */
  jsx?: boolean;

  /**
   * Controls whether the `loc` information to each node.
   * The `loc` property is an object which contains the exact line/column the node starts/ends on.
   * This is similar to the `range` property, except it is line/column relative.
   */
  loc?: boolean;

  /*
   * Allows overriding of function used for logging.
   * When value is `false`, no logging will occur.
   * When value is not provided, `console.log()` will be used.
   */
  loggerFn?: Function | false;

  /**
   * Allows the user to control whether or not two-way AST node maps are preserved
   * during the AST conversion process.
   *
   * By default: the AST node maps are NOT preserved, unless `project` has been specified,
   * in which case the maps are made available on the returned `parserServices`.
   *
   * NOTE: If `preserveNodeMaps` is explicitly set by the user, it will be respected,
   * regardless of whether or not `project` is in use.
   */
  preserveNodeMaps?: boolean;

  /**
   * Absolute (or relative to `tsconfigRootDir`) paths to the tsconfig(s).
   * If this is provided, type information will be returned.
   */
  project?: string | string[];

  /**
   * Controls whether the `range` property is included on AST nodes.
   * The `range` property is a [number, number] which indicates the start/end index of the node in the file contents.
   * This is similar to the `loc` property, except this is the absolute index.
   */
  range?: boolean;

  /**
   * Set to true to create a top-level array containing all tokens from the file.
   */
  tokens?: boolean;

  /**
   * The absolute path to the root directory for all provided `project`s.
   */
  tsconfigRootDir?: string;

  /*
   * The JSX AST changed the node type for string literals
   * inside a JSX Element from `Literal` to `JSXText`.
   * When value is `true`, these nodes will be parsed as type `JSXText`.
   * When value is `false`, these nodes will be parsed as type `Literal`.
   */
  useJSXTextNode?: boolean;

  /**
   ***************************************************************************************
   * IT IS RECOMMENDED THAT YOU DO NOT USE THIS OPTION, AS IT CAUSES PERFORMANCE ISSUES. *
   ***************************************************************************************
   *
   * When passed with `project`, this allows the parser to create a catch-all, default program.
   * This means that if the parser encounters a file not included in any of the provided `project`s,
   * it will not error, but will instead parse the file and its dependencies in a new program.
   *
   * This
   */
  createDefaultProgram?: boolean;
}

// This lets us use generics to type the return value, and removes the need to
// handle the undefined type in the get method
export interface ParserWeakMap<TKey, TValueBase> {
  get<TValue extends TValueBase>(key: TKey): TValue;
  has(key: unknown): boolean;
}

export interface ParserWeakMapESTreeToTSNode<
  TKey extends TSESTree.Node = TSESTree.Node
> {
  get<TKeyBase extends TKey>(key: TKeyBase): TSESTreeToTSNode<TKeyBase>;
  has(key: unknown): boolean;
}

export interface ParserServices {
  program: Program | undefined;
  esTreeNodeToTSNodeMap: ParserWeakMapESTreeToTSNode | undefined;
  tsNodeToESTreeNodeMap:
    | ParserWeakMap<TSNode | TSToken, TSESTree.Node>
    | undefined;
}
