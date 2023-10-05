module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  moduleDirectories: ["node_modules", "<rootDir>"],
  "moduleNameMapper": {
    "@/(.*)": "<rootDir>/$1"
  }
}
