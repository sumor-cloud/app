export function calculateCoverage(coverageJSON) {
  const results = {}
  let totalStatements = 0
  let totalFunctions = 0
  let totalBranches = 0
  let totalStatementCoverage = 0
  let totalFunctionCoverage = 0
  let totalBranchCoverage = 0

  for (const filePath in coverageJSON) {
    const fileCoverage = coverageJSON[filePath]
    const statements = Object.keys(fileCoverage.s).length
    const functions = Object.keys(fileCoverage.f).length
    const branches = Object.keys(fileCoverage.b).length
    const statementCoverage =
      (Object.values(fileCoverage.s).filter(v => v > 0).length / statements) * 100
    const functionCoverage =
      (Object.values(fileCoverage.f).filter(v => v > 0).length / functions) * 100
    const branchCoverage =
      (Object.values(fileCoverage.b).filter(v => v.every(b => b > 0)).length / branches) * 100

    results[filePath] = {
      statements,
      functions,
      branches,
      statementCoverage,
      functionCoverage,
      branchCoverage
    }

    totalStatements += statements
    totalFunctions += functions
    totalBranches += branches
    if (statements > 0) {
      totalStatementCoverage += statementCoverage * statements
    }
    if (functions > 0) {
      totalFunctionCoverage += functionCoverage * functions
    }
    if (branches > 0) {
      totalBranchCoverage += branchCoverage * branches
    }
  }

  const total = {
    statements: totalStatements,
    functions: totalFunctions,
    branches: totalBranches,
    statementCoverage: totalStatementCoverage / totalStatements,
    functionCoverage: totalFunctionCoverage / totalFunctions,
    branchCoverage: totalBranchCoverage / totalBranches
  }

  return { results, total }
}
