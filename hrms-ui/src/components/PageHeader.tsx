import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  breadcrumbs: string[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white mb-1">
          {title}
        </h2>
        <div className="flex items-center text-[13px] text-teal-600 dark:text-teal-400">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span className={index === breadcrumbs.length - 1 ? "text-slate-500 dark:text-slate-400" : ""}>
                {crumb}
              </span>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="h-3 w-3 mx-1 text-slate-400" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card border border-border shadow-sm rounded-full text-sm font-medium text-indigo-600 hover:bg-slate-50 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
    </div>
  );
};
