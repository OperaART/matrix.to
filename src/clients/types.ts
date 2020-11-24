/*
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { SafeLink } from '../parser/types';

/*
 * A collection of descriptive tags that can be added to
 * a clients description.
 */
export enum Platform {
    iOS = 'iOS',
    Android = 'ANDROID',
    Desktop = 'DESKTOP',
}

/*
 * A collection of states used for describing a clients maturity.
 */
export enum Maturity {
    ALPHA = 'ALPHA',
    LATE_ALPHA = 'LATE ALPHA',
    BETA = 'BETA',
    LATE_BETA = 'LATE_BETA',
    STABLE = 'STABLE',
}

/*
 * Used for constructing the discriminated union of all client types.
 */
export enum ClientKind {
    LINKED_CLIENT = 'LINKED_CLIENT',
    TEXT_CLIENT = 'TEXT_CLIENT',
}

export enum ClientId {
    Element = 'element.io',
    ElementDevelop = 'develop.element.io',
    WeeChat = 'weechat',
    Nheko = 'nheko',
    Fractal = 'fractal',
}

/**
 * Define a native distribution channel for a client.
 * E.g App store for apple, PlayStore or F-Droid for Android
 */
export interface InstallLink {
    createInstallURL(deepLink: SafeLink) : string;
    // in AppleStoreLink, we can set the cookie here for deeplinking
    // onInstallChosen(deepLink: SafeLink);
    platform: Platform;
    channelId: string;
    description: string;
}

export class AppleStoreLink implements InstallLink {
    constructor(private org: string, private appId: string) {}

    createInstallURL(deepLink: SafeLink) : string {
        return `https://apps.apple.com/app/${encodeURIComponent(this.org)}/${encodeURIComponent(this.appId)}`;
    }

    get platform() : Platform {
        return Platform.iOS;
    }
    
    get channelId(): string {
        return "apple-app-store";
    }

    get description() {
        return "Download on the App Store";
    }
}

export class PlayStoreLink implements InstallLink {
    constructor(private appId: string) {}

    createInstallURL(deepLink: SafeLink) : string {
        return `https://play.google.com/store/apps/details?id=${encodeURIComponent(this.appId)}&referrer=${encodeURIComponent(deepLink.originalLink)}`;
    }

    get platform() : Platform {
        return Platform.Android;
    }
      
    get channelId(): string {
        return "play-store";
    }

    get description() {
        return "Get it on Google Play";
    }
}

export class FDroidLink implements InstallLink {
    constructor(private appId: string) {}

    createInstallURL(deepLink: SafeLink) : string {
        return `https://f-droid.org/packages/${encodeURIComponent(this.appId)}`;
    }

    get platform() : Platform {
        return Platform.Android;
    }

    get channelId(): string {
        return "fdroid";
    }

    get description() {
        return "Get it on F-Droid";
    }
}

/*
 * The descriptive details of a client
 */
export interface ClientDescription {
    name: string;
    author: string;
    homepage: string;
    logo: string;
    description: string;
    platforms: Platform[];
    maturity: Maturity;
    clientId: ClientId;
    experimental: boolean;
    linkSupport: (link: SafeLink) => boolean;
    installLinks: InstallLink[];
}

/*
 * A client which can be opened using a link with the matrix resource.
 */
export interface LinkedClient extends ClientDescription {
    kind: ClientKind.LINKED_CLIENT;
    toUrl(parsedLink: SafeLink): URL;
}

/*
 * A client which provides isntructions for how to access the descired
 * resource.
 */
export interface TextClient extends ClientDescription {
    kind: ClientKind.TEXT_CLIENT;
    toInviteString(parsedLink: SafeLink): JSX.Element;
    copyString(parsedLink: SafeLink): string;
}

/*
 * A description for a client as well as a method for converting matrix.to
 * links to the client's specific representation.
 */
export type Client = LinkedClient | TextClient;
