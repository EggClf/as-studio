import { Route, Routes } from 'react-router-dom';
import IntentsMonitoringPage from './IntentsMonitoringPage';
import IntentDetailPage from './IntentDetailPage';
import MLAnalysisPage from './MLAnalysisPage';

/**
 * Vulcan section router.
 *
 * Routes:
 *   /vulcan              → Global Intents Monitoring dashboard
 *   /vulcan/analysis     → ML Analysis (legacy network cells + decision tree)
 *   /vulcan/:intentId    → Intent detail page
 */
const VulcanPage = () => {
    return (
        <Routes>
            <Route index element={<IntentsMonitoringPage />} />
            <Route path="analysis" element={<MLAnalysisPage />} />
            <Route path=":intentId" element={<IntentDetailPage />} />
        </Routes>
    );
};

export default VulcanPage;

