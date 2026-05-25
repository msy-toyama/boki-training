import { beforeEach, describe, expect, it } from 'vitest';
import { clearErrorLogs, getErrorLogs, recordError } from '../../services/errorMonitoringService';

describe('errorMonitoringService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('エラーを新しい順に保存する', () => {
    recordError('first', new Error('first error'));
    recordError('second', 'second error');

    const logs = getErrorLogs();
    expect(logs).toHaveLength(2);
    expect(logs[0].source).toBe('second');
    expect(logs[1].message).toBe('first error');
  });

  it('ログを削除できる', () => {
    recordError('test', new Error('test error'));
    clearErrorLogs();

    expect(getErrorLogs()).toEqual([]);
  });
});