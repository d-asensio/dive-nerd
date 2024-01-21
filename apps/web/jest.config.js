module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  moduleDirectories: ["node_modules", "<rootDir>"],
  "moduleNameMapper": {
    "@/model-builders/(.*)": "<rootDir>/.jest/model-builders/$1",
    "@/(.*)": "<rootDir>/$1"
  }
}
