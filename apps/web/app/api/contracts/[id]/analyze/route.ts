/**
 * Contract Analysis API
 * Epic 4: AI Analysis Engine
 * 
 * Analyzes a specific contract using AI
 */

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  successResponse,
  unauthorizedError,
  notFoundError,
  internalError,
} from '@/lib/api-response';
import { getAIAnalysisService } from '@/lib/ai-analysis';
import {
  notifyAnalysisComplete,
  notifyHighRiskAlert,
  notifyComplianceAlert,
} from '@/lib/notification-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const contractId = params.id;

    // Get contract from database
    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        userId: session.user.id,
      },
    });

    if (!contract) {
      return notFoundError('Contract');
    }

    // Check if already analyzed
    const existingAnalysis = await prisma.analysis.findUnique({
      where: { contractId },
    });

    if (existingAnalysis) {
      return successResponse({
        analysis: existingAnalysis,
        message: 'Contract already analyzed',
        cached: true,
      });
    }

    // Check if we have extracted text
    if (!contract.extractedText) {
      return successResponse({
        message: 'Contract text not yet extracted. Please try again.',
        status: contract.status,
      }, 202); // Accepted but not processed
    }

    // Analyze with AI
    const aiService = getAIAnalysisService();
    const analysis = await aiService.analyzeContract(
      contract.extractedText,
      contract.title
    );

    // Save analysis to database
    const savedAnalysis = await prisma.analysis.create({
      data: {
        contractId: contract.id,
        riskLevel: analysis.riskLevel,
        riskScore: analysis.riskScore,
        liabilityRisks: analysis.liabilityRisks,
        terminationRisks: analysis.terminationRisks,
        renewalRisks: analysis.renewalRisks,
        detectedValue: analysis.detectedValue,
        paymentTerms: analysis.paymentTerms,
        priceEscalation: analysis.priceEscalation,
        hiddenCosts: analysis.hiddenCosts,
        keyTerms: analysis.keyTerms,
        complianceIssues: analysis.complianceIssues,
        missingClauses: analysis.missingClauses,
        recommendations: analysis.recommendations,
        confidence: analysis.confidence,
        model: analysis.model,
      },
    });

    // Update contract status
    await prisma.contract.update({
      where: { id: contract.id },
      data: {
        status: 'ANALYZED',
        vendor: analysis.vendor || contract.vendor,
        value: analysis.detectedValue || contract.value,
        startDate: analysis.startDate || contract.startDate,
        endDate: analysis.endDate || contract.endDate,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'CONTRACT_ANALYZED',
        title: 'Contract Analysis Complete',
        message: `${contract.title} has been analyzed. Risk level: ${analysis.riskLevel}`,
        link: `/contracts/${contract.id}`,
        read: false,
      },
    });

    return successResponse({
      analysis: savedAnalysis,
      summary: {
        riskLevel: analysis.riskLevel,
        riskScore: analysis.riskScore,
        vendor: analysis.vendor,
        autoRenewal: analysis.autoRenewal,
        confidence: analysis.confidence,
      },
      message: 'Contract analyzed successfully',
    }, 201);
  } catch (error) {
    console.error('Analysis error:', error);
    return internalError('Failed to analyze contract');
  }
}

/**
 * Get existing analysis
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const contractId = params.id;

    // Get contract with analysis
    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        userId: session.user.id,
      },
      include: {
        analysis: true,
      },
    });

    if (!contract) {
      return notFoundError('Contract');
    }

    if (!contract.analysis) {
      return successResponse({
        analyzed: false,
        message: 'Contract not yet analyzed',
      });
    }

    return successResponse({
      analyzed: true,
      analysis: contract.analysis,
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    return internalError('Failed to get analysis');
  }
}
 if (!contract) {
      return notFoundError('Contract');
    }

    if (!contract.analysis) {
      return successResponse({
        analyzed: false,
        message: 'Contract not yet analyzed',
      });
    }

    return successResponse({
      analyzed: true,
      analysis: contract.analysis,
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    return internalError('Failed to get analysis');
  }
}
