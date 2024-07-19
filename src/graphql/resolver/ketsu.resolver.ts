import { KetsuBoardService } from './../../services/ketsuboard.services';
import {
  IApproverList,
  IIsContactList,
  IKetsuData,
  IReasonList,
} from 'src/model/validator/ketsuvalidator';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  OApproverData,
  OIISContactList,
  OKetsuData,
  OReasonList,
} from '@schemaModels/viewKetsu.model';

import { StatusResponse } from '@schemaModels/viewEmployee.model';
import { IStatusResponse } from '@viewModels/viewTableModel';
import {
  AbsentValueArgs,
  ApproverNameArgs,
  KetsuArgs,
} from '../args/dashboard.args';
/**
 * Resolver for Ketsu data operations.
 * This class provides GraphQL queries and mutations for handling
 * operations related to Ketsu data, such as fetching Ketsu logs,
 * approver lists, contact lists, reason lists, and updating absent information.
 */
@Resolver(() => OKetsuData)
export class KetsuResolver {
  constructor(private ketsuService: KetsuBoardService) {}

  /**
   * Fetches Ketsu logs based on provided arguments.
   * @param args Arguments for filtering Ketsu logs.
   * @returns A promise that resolves to the Ketsu data.
   */
  @Query(() => OKetsuData, { defaultValue: [] })
  async KetsuTable(@Args() args: KetsuArgs): Promise<IKetsuData | []> {
    return await this.ketsuService.getKetsuLogs(args);
  }

  /**
   * Retrieves a list of approvers based on provided arguments.
   * @param args Arguments for filtering the approver list.
   * @returns A promise that resolves to the list of approvers.
   */
  @Query(() => [OApproverData], { defaultValue: [] })
  async ApproverList(@Args() args: ApproverNameArgs): Promise<IApproverList> {
    return await this.ketsuService.getApproverList(args);
  }

  /**
   * Fetches the list of IS contacts.
   * @returns A promise that resolves to the list of IS contacts.
   */
  @Query(() => [OIISContactList], { defaultValue: [] })
  async ContactList(): Promise<IIsContactList> {
    return await this.ketsuService.getisContactList();
  }

  /**
   * Retrieves the list of reasons.
   * @returns A promise that resolves to the list of reasons.
   */
  @Query(() => [OReasonList], { defaultValue: [] })
  async ReasonList(): Promise<IReasonList> {
    return await this.ketsuService.getReasonList();
  }

  /**
   * Updates absent information for a worker.
   * @param args Arguments containing the details for the update operation.
   * @returns A promise that resolves to the status of the update operation.
   */
  @Mutation(() => StatusResponse, { nullable: true })
  async UpdateAbsentInfo(
    @Args() args: AbsentValueArgs,
  ): Promise<IStatusResponse> {
    return await this.ketsuService.updateAbsentWorker(args);
  }
  /**
   * Downloads Ketsu logs based on provided arguments.
   * This query allows the user to download Ketsu logs in a specific format.
   *
   * @param args - Arguments for filtering and specifying the format of the Ketsu logs.
   * @returns A promise that resolves to a string containing the download link or null if the operation fails.
   */
  @Query(() => String, { nullable: true })
  async DownloadKetsuLogs(@Args() args: KetsuArgs): Promise<string | null> {
    return await this.ketsuService.downloadKetsuLogs(args);
  }
}
