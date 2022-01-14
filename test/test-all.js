/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { strict as assert } from 'assert';

import { KMP } from '../src/kmp.js';

function testTable() {
    let t1 = KMP.makePartialMatchTable(KMP.stringToChars('abaab'));
    assert.deepEqual(t1, [0, 0, 1, 1, 2]);

    let t2 = KMP.makePartialMatchTable(KMP.stringToChars('aaaab'));
    assert.deepEqual(t2, [0, 1, 2, 3, 0]);

    let t3 = KMP.makePartialMatchTable(KMP.stringToChars('aabaaa'));
    assert.deepEqual(t3, [0, 1, 0, 1, 2, 2]);

    let t4 = KMP.makePartialMatchTable(KMP.stringToChars('abcdabd'));
    assert.deepEqual(t4, [0, 0, 0, 0, 1, 2, 0]);

    let t5 = KMP.makePartialMatchTable(KMP.stringToChars('hello world'));
    assert.deepEqual(t5, [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0
    ]);

    let t6 = KMP.makePartialMatchTable(KMP.stringToChars('天苍苍野茫茫'));
    assert.deepEqual(t6, [
        0, 0, 0, 0, 0, 0
    ]);

    let t7 = KMP.makePartialMatchTable(KMP.stringToChars('上海自来水来自海上'));
    assert.deepEqual(t7, [
        0, 0, 0, 0, 0,
        0, 0, 0, 1
    ]);
}

function testFind() {
    let s = 'ababbbabbbabaababaaabaaaaabababaabcdabdbabab';

    let k1 = 'abaab';
    assert.equal(KMP.find(s, k1), s.indexOf(k1));

    let k2 = 'aaaab';
    assert.equal(KMP.find(s, k2), s.indexOf(k2));

    let k3 = 'aabaaa';
    assert.equal(KMP.find(s, k3), s.indexOf(k3));

    let k4 = 'abcdabd';
    assert.equal(KMP.find(s, k4), s.indexOf(k4));
}

function testKMP() {
    testTable();
    testFind();

    console.log('testKMP() passed.');
}

(() => {
    testKMP();
})();