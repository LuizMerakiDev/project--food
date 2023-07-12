"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// src/modules/user/useCase/auth-google/auth-google-useCase.ts
var auth_google_useCase_exports = {};
__export(auth_google_useCase_exports, {
  AuthGoogleUseCase: () => AuthGoogleUseCase
});
module.exports = __toCommonJS(auth_google_useCase_exports);
var import_tsyringe = require("tsyringe");
var import_axios = __toESM(require("axios"));

// src/shared/Errors/AppError.ts
var AppError = class {
  constructor(message, statusCode = 401) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/shared/provider/GenerateAuth.ts
var import_jsonwebtoken = require("jsonwebtoken");
var GenerateAuth = class {
  static token({ email, name, id, avatar }) {
    const token = (0, import_jsonwebtoken.sign)(
      {
        email,
        name,
        id,
        avatar
      },
      `${process.env.JWT_PASS}`,
      { expiresIn: process.env.JWT_EXPIRE, subject: id }
    );
    return {
      id,
      name,
      email,
      token
    };
  }
};

// src/modules/user/useCase/auth-google/auth-google-useCase.ts
var AuthGoogleUseCase = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute(access_token) {
    const userResponse = await import_axios.default.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    const { email } = userResponse.data;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("e-mail n\xE3o cadastrado", 404);
    }
    const resultUser = GenerateAuth.token({
      email: user.email,
      name: user.name,
      id: user.id
    });
    return { resultUser };
  }
};
AuthGoogleUseCase = __decorateClass([
  (0, import_tsyringe.injectable)(),
  __decorateParam(0, (0, import_tsyringe.inject)("KnexUserRepository"))
], AuthGoogleUseCase);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthGoogleUseCase
});
