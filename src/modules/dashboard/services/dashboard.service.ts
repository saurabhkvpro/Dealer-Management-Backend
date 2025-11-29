import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dealer, DealerDocument } from '../../dealers/schemas/dealer.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Dealer.name) private dealerModel: Model<DealerDocument>,
  ) {}

  async getStats() {
    const [total, active, inactive, byRegion, recentDealers] = await Promise.all([
      this.dealerModel.countDocuments({ isDeleted: false }),
      this.dealerModel.countDocuments({ isDeleted: false, status: 'ACTIVE' }),
      this.dealerModel.countDocuments({ isDeleted: false, status: 'INACTIVE' }),
      this.dealerModel.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$region', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      this.dealerModel
        .find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email region status createdAt'),
    ]);

    return {
      success: true,
      data: {
        total,
        active,
        inactive,
        byRegion,
        recentDealers,
      },
    };
  }
}
