'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExerciseProgress } from '@/types/progress';

interface ProgressRestoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progress: ExerciseProgress | null;
  onContinue: () => void;
  onReset: () => void;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function ProgressRestoreDialog({
  open,
  onOpenChange,
  progress,
  onContinue,
  onReset,
}: ProgressRestoreDialogProps) {
  if (!progress) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <span className="text-2xl">📌</span>
            发现未完成的练习
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            检测到您之前有未完成的答题进度，是否继续？
          </DialogDescription>
        </DialogHeader>

        <div className="bg-blue-50 rounded-lg p-4 space-y-2 my-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">练习题：</span>
            <span className="font-medium text-gray-800">{progress.moduleName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">进度：</span>
            <span className="font-medium text-blue-600">
              已完成 {progress.answeredCount} / {progress.totalQuestions} 题
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">上次答题：</span>
            <span className="text-gray-800">{formatDate(progress.updatedAt)}</span>
          </div>
        </div>

        <DialogFooter className="flex gap-3 sm:justify-center">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onReset();
            }}
            className="flex-1"
          >
            重置进度
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onContinue();
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            继续答题
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
