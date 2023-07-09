import { convertSongSection } from './osSongSectionConverter';

describe('SongSectionLabel', () => {
  it('should convert correctly for `verse`', () => {
    expect(convertSongSection('V')).toEqual('v1');
    expect(convertSongSection('V1')).toEqual('v1');
    expect(convertSongSection('V2')).toEqual('v2');
    expect(convertSongSection('V3')).toEqual('v3');
    expect(convertSongSection('V4')).toEqual('v4');
    expect(convertSongSection('V5')).toEqual('v5');
    expect(convertSongSection('V6')).toEqual('v6');
    expect(convertSongSection('V7')).toEqual('v7');
    expect(convertSongSection('V8')).toEqual('v8');
    expect(convertSongSection('V9')).toEqual('v9');
    expect(convertSongSection('V10')).toEqual('v10');
    expect(convertSongSection('V11')).toEqual('v11');
    expect(convertSongSection('V12')).toEqual('v12');

    expect(convertSongSection('V99')).toEqual('v99');
  });

  it('should convert correctly for `pre-chorus`', () => {
    expect(convertSongSection('P')).toEqual('p');
    expect(convertSongSection('P1')).toEqual('p');
    expect(convertSongSection('P2')).toEqual('p2');
    expect(convertSongSection('P3')).toEqual('p3');
    expect(convertSongSection('P4')).toEqual('p4');
    expect(convertSongSection('P5')).toEqual('p5');
    expect(convertSongSection('P6')).toEqual('p6');
    expect(convertSongSection('P7')).toEqual('p7');
    expect(convertSongSection('P8')).toEqual('p8');
    expect(convertSongSection('P9')).toEqual('p9');
    expect(convertSongSection('P10')).toEqual('p10');
    expect(convertSongSection('P11')).toEqual('p11');
    expect(convertSongSection('P12')).toEqual('p12');

    expect(convertSongSection('P99')).toEqual('p99');
  });

  it('should convert correctly for `chorus`', () => {
    expect(convertSongSection('C')).toEqual('c');
    expect(convertSongSection('C1')).toEqual('c');
    expect(convertSongSection('C2')).toEqual('c2');
    expect(convertSongSection('C3')).toEqual('c3');
    expect(convertSongSection('C4')).toEqual('c4');
    expect(convertSongSection('C5')).toEqual('c5');
    expect(convertSongSection('C6')).toEqual('c6');
    expect(convertSongSection('C7')).toEqual('c7');
    expect(convertSongSection('C8')).toEqual('c8');
    expect(convertSongSection('C9')).toEqual('c9');
    expect(convertSongSection('C10')).toEqual('c10');
    expect(convertSongSection('C11')).toEqual('c11');
    expect(convertSongSection('C12')).toEqual('c12');

    expect(convertSongSection('C99')).toEqual('c99');
  });

  it('should convert correctly for `bridge`', () => {
    expect(convertSongSection('B')).toEqual('b');
    expect(convertSongSection('B1')).toEqual('b');
    expect(convertSongSection('B2')).toEqual('b2');
    expect(convertSongSection('B3')).toEqual('b3');
    expect(convertSongSection('B4')).toEqual('b4');
    expect(convertSongSection('B5')).toEqual('b5');
    expect(convertSongSection('B6')).toEqual('b6');
    expect(convertSongSection('B7')).toEqual('b7');
    expect(convertSongSection('B8')).toEqual('b8');
    expect(convertSongSection('B9')).toEqual('b9');
    expect(convertSongSection('B10')).toEqual('b10');
    expect(convertSongSection('B11')).toEqual('b11');
    expect(convertSongSection('B12')).toEqual('b12');

    expect(convertSongSection('B99')).toEqual('b99');
  });

  it('should convert correctly for `ending`', () => {
    expect(convertSongSection('T')).toEqual('e');
    expect(convertSongSection('T1')).toEqual('e');
    expect(convertSongSection('T2')).toEqual('e2');
    expect(convertSongSection('T3')).toEqual('e3');
  });

  it('should throw for unsupported song sections', () => {
    expect(() => convertSongSection('X')).toThrowErrorMatchingInlineSnapshot(
      `"Unknown song section: X"`,
    );
  });
});
