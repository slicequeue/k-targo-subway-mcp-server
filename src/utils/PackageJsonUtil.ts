import { readFileSync } from 'fs';
import { join } from 'path';

export interface PackageJson {
  name: string;
  version: string;
  type?: string;
  main?: string;
  bin?: Record<string, string>;
  scripts?: Record<string, string>;
  author?: string;
  license?: string;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: any;
}

export class PackageJsonUtil {
  private static instance: PackageJsonUtil;
  private packageJson: PackageJson | null = null;
  private packageJsonPath: string;

  private constructor() {
    this.packageJsonPath = join(process.cwd(), 'package.json');
  }

  /**
   * 싱글톤 인스턴스를 반환합니다.
   */
  public static getInstance(): PackageJsonUtil {
    if (!PackageJsonUtil.instance) {
      PackageJsonUtil.instance = new PackageJsonUtil();
    }
    return PackageJsonUtil.instance;
  }

  /**
   * package.json 파일을 읽어옵니다.
   */
  public readPackageJson(): PackageJson {
    if (!this.packageJson) {
      try {
        const fileContent = readFileSync(this.packageJsonPath, 'utf-8');
        this.packageJson = JSON.parse(fileContent);
      } catch (error) {
        throw new Error(`package.json 파일을 읽을 수 없습니다: ${error}`);
      }
    }
    if (!this.packageJson) {
      throw new Error('package.json 파일을 읽을 수 없습니다');
    }
    return this.packageJson;
  }

  /**
   * 프로젝트 이름을 반환합니다.
   */
  public getName(): string {
    return this.readPackageJson().name;
  }

  /**
   * 프로젝트 버전을 반환합니다.
   */
  public getVersion(): string {
    return this.readPackageJson().version;
  }

  /**
   * 프로젝트 타입을 반환합니다.
   */
  public getType(): string | undefined {
    return this.readPackageJson().type;
  }

  /**
   * 메인 진입점을 반환합니다.
   */
  public getMain(): string | undefined {
    return this.readPackageJson().main;
  }

  /**
   * 바이너리 설정을 반환합니다.
   */
  public getBin(): Record<string, string> | undefined {
    return this.readPackageJson().bin;
  }

  /**
   * 스크립트를 반환합니다.
   */
  public getScripts(): Record<string, string> | undefined {
    return this.readPackageJson().scripts;
  }

  /**
   * 특정 스크립트를 반환합니다.
   */
  public getScript(scriptName: string): string | undefined {
    return this.readPackageJson().scripts?.[scriptName];
  }

  /**
   * 작성자를 반환합니다.
   */
  public getAuthor(): string | undefined {
    return this.readPackageJson().author;
  }

  /**
   * 라이선스를 반환합니다.
   */
  public getLicense(): string | undefined {
    return this.readPackageJson().license;
  }

  /**
   * 설명을 반환합니다.
   */
  public getDescription(): string | undefined {
    return this.readPackageJson().description;
  }

  /**
   * 의존성을 반환합니다.
   */
  public getDependencies(): Record<string, string> | undefined {
    return this.readPackageJson().dependencies;
  }

  /**
   * 개발 의존성을 반환합니다.
   */
  public getDevDependencies(): Record<string, string> | undefined {
    return this.readPackageJson().devDependencies;
  }

  /**
   * 특정 의존성 버전을 반환합니다.
   */
  public getDependencyVersion(dependencyName: string): string | undefined {
    return this.readPackageJson().dependencies?.[dependencyName];
  }

  /**
   * 특정 개발 의존성 버전을 반환합니다.
   */
  public getDevDependencyVersion(dependencyName: string): string | undefined {
    return this.readPackageJson().devDependencies?.[dependencyName];
  }

  /**
   * 모든 의존성(일반 + 개발)을 반환합니다.
   */
  public getAllDependencies(): Record<string, string> {
    const deps = this.readPackageJson().dependencies || {};
    const devDeps = this.readPackageJson().devDependencies || {};
    return { ...deps, ...devDeps };
  }

  /**
   * 의존성 목록을 반환합니다.
   */
  public getDependencyNames(): string[] {
    return Object.keys(this.readPackageJson().dependencies || {});
  }

  /**
   * 개발 의존성 목록을 반환합니다.
   */
  public getDevDependencyNames(): string[] {
    return Object.keys(this.readPackageJson().devDependencies || {});
  }

  /**
   * 모든 의존성 이름 목록을 반환합니다.
   */
  public getAllDependencyNames(): string[] {
    return Object.keys(this.getAllDependencies());
  }

  /**
   * package.json 파일 경로를 반환합니다.
   */
  public getPackageJsonPath(): string {
    return this.packageJsonPath;
  }

  /**
   * package.json 데이터를 새로고침합니다.
   */
  public refresh(): void {
    this.packageJson = null;
  }

  /**
   * 프로젝트 정보를 요약하여 반환합니다.
   */
  public getSummary(): {
    name: string;
    version: string;
    description?: string;
    author?: string;
    license?: string;
    dependenciesCount: number;
    devDependenciesCount: number;
  } {
    const pkg = this.readPackageJson();
    return {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      author: pkg.author,
      license: pkg.license,
      dependenciesCount: Object.keys(pkg.dependencies || {}).length,
      devDependenciesCount: Object.keys(pkg.devDependencies || {}).length,
    };
  }
} 